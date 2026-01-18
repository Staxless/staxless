import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface AccountSettingsProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    language: string;
  };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl">
          <AvatarImage alt={user.name || 'User'} src={user.avatar} />
          <AvatarFallback>
            {(user.name || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold text-xl">{user.name}</h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <Button className="ml-auto" variant="outline">
          Manage
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input defaultValue={user.name} id="name" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input defaultValue={user.email} id="email" type="email" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language">Language</Label>
          <Select defaultValue={user.language}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <Button>Save Changes</Button>
    </div>
  );
}
