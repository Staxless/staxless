import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function DataSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data & Privacy</h3>
        <p className="text-sm text-muted-foreground">Manage your data and privacy preferences.</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Usage Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Allow us to collect anonymous usage data to improve our service.
            </p>
          </div>
          <Switch id="analytics" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Marketing Communications</Label>
            <p className="text-sm text-muted-foreground">Receive emails about new features and updates.</p>
          </div>
          <Switch id="marketing" />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Export Data</h3>
        <p className="text-sm text-muted-foreground">Download a copy of your data or delete your account.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline">Export Data</Button>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  )
}

