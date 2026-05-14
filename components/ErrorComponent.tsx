interface ErrorNoticeProps {
  title: string;
  errorMessage: string;
}

export default function ErrorNotice({ title, errorMessage }: ErrorNoticeProps) {
  return (
    <div className="max-w-md mx-auto px-6 py-3 bg-primary/10 border border-primary text-secondary rounded">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{errorMessage}</p>
    </div>
  );
}
