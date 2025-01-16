export const Loader = ({
  title,
  logo,
  text='Logging you in..',
}: {
  title: string;
  logo?: React.ReactNode;
  text?: React.ReactNode;
}) => {
  return (
    <div className="absolute left-0 top-0 z-10 flex h-full w-full animate-fade-in items-center justify-center bg-black bg-opacity-30">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-48 w-48">
          {logo || <div className="absolute h-full w-full animate-bounce rounded-full bg-[#0096FF] bg-gradient-to-br from-white/40 to-transparent"></div>}
        </div>
        <div className="text-2xl font-bold">{title}</div>
        <div className="text-xl text-gray-500">{text}</div>

        <div className="flex flex-row items-center gap-2">
          <img src="https://onchainkit.xyz/favicon/48x48.png?v4-19-24" alt="MiniKit" width={48} height={48} />
          Built with MiniKit
        </div>
      </div>
    </div>
  );
};