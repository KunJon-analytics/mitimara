import { isWithinEvent, WithinEventParams } from "@/lib/local-bounty/utils";

const DistanceText = (props: { params: WithinEventParams }) => {
  const data = isWithinEvent(props.params);
  const text = data.withinEvent
    ? "You are within the hunt location! 🎉 Join the Local Bounty Hunt now and start planting or verifying trees to earn Pi tokens. 🌳💚"
    : `You are ${data.distanceFromEvent}km away from the hunt location. 🌍 Move closer to participate in the Local Bounty Hunt and earn Pi tokens. 🌳💚`;

  return <p className="text-xs text-muted-foreground">{text}</p>;
};

export default DistanceText;
