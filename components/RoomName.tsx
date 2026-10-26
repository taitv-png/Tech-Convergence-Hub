const SINGLE_LINE_NAME = "Smart Mobility Lab - Rail Systems Lab";

export function RoomName({ name }: { name: string }) {
  return (
    <bdi className="tch-room-name" data-room-name={name}>
      {name.split(" | ").map((line, index) => (
        <bdi
          className={"tch-room-name__line" + (line === SINGLE_LINE_NAME ? " tch-room-name__line--single" : "")}
          key={`${index}-${line}`}
        >
          {line}
        </bdi>
      ))}
    </bdi>
  );
}
