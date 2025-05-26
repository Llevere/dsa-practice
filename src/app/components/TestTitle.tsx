export default function TestTitle({ children }: { children: string }) {
    return (
        <div className="bg-base-200 border border-base-300 rounded-lg p-6 shadow-md text-center mt-5 text-primary">
            <h1 className="font-bold">Question</h1>
            <p className="mt-2 text-sm opacity-80">{children}</p>
        </div>
    );
}
