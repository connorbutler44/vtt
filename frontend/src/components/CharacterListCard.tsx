interface Props {
  src: string;
  name: string;
  ac: number;
  currentHealth: number;
  maxHealth: number;
  onClick: () => void;
}

export const CharacterListCard = (props: Props) => {
  return (
    <div
      className="w-full h-26 bg-gray-800 rounded-lg shadow-md p-4 flex text-white hover:shadow-lg cursor-pointer hover:outline-2 hover:outline-yellow-300"
      onClick={props.onClick}
    >
      <img
        src={props.src}
        className=" rounded-full mr-4 border border-gray-600"
      />
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-semibold">{props.name}</h2>
        <p className="font-mono text-sm">
          <label className="rounded opacity-90 text">HP - </label>{" "}
          <span>
            {props.currentHealth}/{props.maxHealth}
          </span>
        </p>
        <p className="font-mono text-sm">
          <label className="rounded opacity-90 text">AC - </label>{" "}
          <span>{props.ac}</span>
        </p>
      </div>
    </div>
  );
};
