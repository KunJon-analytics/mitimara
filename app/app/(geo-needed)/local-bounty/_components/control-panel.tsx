import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export type MapPositions = {
  type: "hunt" | "user";
  longitude: number;
  latitude: number;
};

type ControlPanelProps = {
  cities: MapPositions[];
  onSelectCity: ({ longitude, latitude }: MapPositions) => void;
};

function ControlPanel({ cities, onSelectCity }: ControlPanelProps) {
  return (
    <Card className="absolute top-0 right-0 p-2">
      <h3>Positions</h3>
      {cities.map((city, index) => (
        <div
          className="flex justify-center items-center gap-1"
          key={`btn-${index}`}
        >
          <Input
            type="radio"
            name="city"
            id={`city-${index}`}
            defaultChecked={city.type === "hunt"}
            onClick={() => onSelectCity(city)}
          />
          <Label className="capitalize" htmlFor={`city-${index}`}>
            {city.type}
          </Label>
        </div>
      ))}
    </Card>
  );
}

export default React.memo(ControlPanel);
