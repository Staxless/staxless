import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export function DataSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Data & Privacy</h3>
        <p className="text-muted-foreground text-sm">
          Manage your data and privacy preferences.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Usage Analytics</Label>
            <p className="text-muted-foreground text-sm">
              Allow us to collect anonymous usage data to improve our service.
            </p>
          </div>
          <Switch defaultChecked id="analytics" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Marketing Communications</Label>
            <p className="text-muted-foreground text-sm">
              Receive emails about new features and updates.
            </p>
          </div>
          <Switch id="marketing" />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Export Data</h3>
        <p className="text-muted-foreground text-sm">
          Download a copy of your data or delete your account.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline">Export Data</Button>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
