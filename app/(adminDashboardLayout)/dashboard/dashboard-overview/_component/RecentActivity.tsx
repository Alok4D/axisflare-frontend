import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  color: string;
}

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              {/* Color Indicator */}
              <div
                className={`h-2 w-2 rounded-full ${activity.color} mt-2 flex-shrink-0`}
              />

              {/* Activity Content */}
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-base">{activity.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
