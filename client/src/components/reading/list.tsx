import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ExternalLink, Trash, Edit } from "lucide-react";
import { Link, LinkGroup } from "@shared/schema";
import { getLinks, saveLinks, getLinkGroups, saveLinkGroups } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function ReadingList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [groups, setGroups] = useState<LinkGroup[]>([]);
  const [newLink, setNewLink] = useState({ url: "", title: "", groupId: "" });
  const [newGroup, setNewGroup] = useState("");
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLinks(getLinks());
    setGroups(getLinkGroups());
  }, []);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addLink = () => {
    if (!validateUrl(newLink.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    const link: Link = {
      id: nanoid(),
      url: newLink.url,
      title: newLink.title || newLink.url,
      groupId: newLink.groupId || undefined,
    };

    const updatedLinks = [...links, link];
    setLinks(updatedLinks);
    saveLinks(updatedLinks);

    setNewLink({ url: "", title: "", groupId: "" });

    toast({
      title: "Link added",
      description: "Your link has been added to the reading list",
    });
  };

  const updateLink = () => {
    if (!editingLink) return;

    if (!validateUrl(editingLink.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    const updatedLinks = links.map(link =>
      link.id === editingLink.id ? editingLink : link
    );
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
    setEditingLink(null);

    toast({
      title: "Link updated",
      description: "Your link has been updated successfully",
    });
  };

  const handleDelete = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    saveLinks(updatedLinks);

    // Also remove the link from any groups that contain it
    const updatedGroups = groups.map(group => ({
      ...group,
      linkIds: group.linkIds.filter(linkId => linkId !== id)
    }));
    setGroups(updatedGroups);
    saveLinkGroups(updatedGroups);

    toast({
      title: "Link deleted",
      description: "The link has been removed from your reading list",
    });
  };

  const addGroup = () => {
    if (!newGroup.trim()) return;

    const group: LinkGroup = {
      id: nanoid(),
      name: newGroup,
      linkIds: [],
    };

    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    saveLinkGroups(updatedGroups);
    setNewGroup("");

    toast({
      title: "Group created",
      description: "New link group has been created",
    });
  };

  const openGroupLinks = (groupId: string) => {
    const groupLinks = links.filter(link => link.groupId === groupId);
    groupLinks.forEach(link => {
      window.open(link.url, '_blank');
    });

    toast({
      title: "Opening links",
      description: `Opening ${groupLinks.length} links from the group`,
    });
  };

  const deleteGroup = (groupId: string) => {
    // First, update all links that were in this group to be ungrouped
    const updatedLinks = links.map(link => 
      link.groupId === groupId ? { ...link, groupId: undefined } : link
    );
    setLinks(updatedLinks);
    saveLinks(updatedLinks);

    // Then remove the group
    const updatedGroups = groups.filter(group => group.id !== groupId);
    setGroups(updatedGroups);
    saveLinkGroups(updatedGroups);

    toast({
      title: "Group deleted",
      description: "The group has been removed from your reading list",
    });
  };

  const moveLink = (linkId: string, newGroupId: string | undefined) => {
    const updatedLinks = links.map(link =>
      link.id === linkId ? { ...link, groupId: newGroupId } : link
    );
    setLinks(updatedLinks);
    saveLinks(updatedLinks);

    // Update group linkIds
    const updatedGroups = groups.map(group => ({
      ...group,
      linkIds: newGroupId === group.id 
        ? [...group.linkIds, linkId]
        : group.linkIds.filter(id => id !== linkId)
    }));
    setGroups(updatedGroups);
    saveLinkGroups(updatedGroups);

    toast({
      title: "Link moved",
      description: "The link has been moved to a different group",
    });
  };

  const groupedLinks = groups.map(group => ({
    ...group,
    links: links.filter(link => link.groupId === group.id),
  }));

  const ungroupedLinks = links.filter(link => !link.groupId);

  return (
    <div className="space-y-6">
      {/* Add New Link */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="URL"
                value={newLink.url}
                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
              />
              <Input
                placeholder="Title (optional)"
                value={newLink.title}
                onChange={e => setNewLink({ ...newLink, title: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={newLink.groupId}
                onValueChange={value => setNewLink({ ...newLink, groupId: value })}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select group (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Group */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="New group name"
              value={newGroup}
              onChange={e => setNewGroup(e.target.value)}
            />
            <Button onClick={addGroup}>
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grouped Links */}
      {groupedLinks.map(group => (
        <Card key={group.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <div className="flex gap-2">
                <Button onClick={() => openGroupLinks(group.id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open All
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteGroup(group.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {group.links.map(link => (
                <div key={link.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 hover:underline"
                  >
                    {link.title}
                  </a>
                  <div className="flex gap-2">
                    <Select
                      value={link.groupId || ""}
                      onValueChange={(value) => moveLink(link.id, value || undefined)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Move to group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ungrouped</SelectItem>
                        {groups.map(g => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Ungrouped Links */}
      {ungroupedLinks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Ungrouped Links</h3>
            <div className="space-y-2">
              {ungroupedLinks.map(link => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 hover:underline"
                  >
                    {link.title}
                  </a>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingLink(link)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Link</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="URL"
                            value={editingLink?.url}
                            onChange={e =>
                              setEditingLink(link =>
                                link ? { ...link, url: e.target.value } : null
                              )
                            }
                          />
                          <Input
                            placeholder="Title"
                            value={editingLink?.title}
                            onChange={e =>
                              setEditingLink(link =>
                                link ? { ...link, title: e.target.value } : null
                              )
                            }
                          />
                          <Button onClick={updateLink}>Save Changes</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}