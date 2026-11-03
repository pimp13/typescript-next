import Link from "next/link";

const quotePattern = /(>>\d+)/g;

type RenderCommentProps = {
  comment: string;
  boardSlug: string;
  threadId: string;
};

export function RenderComment({
  comment,
  boardSlug,
  threadId,
}: RenderCommentProps) {
  const lines = comment.split("\n");

  return (
    <div className="space-y-1 text-sm leading-relaxed whitespace-pre-wrap break-words">
      {lines.map((line, lineIndex) => {
        const isGreentext = line.trimStart().startsWith(">");
        const parts = line.split(quotePattern);

        return (
          <p
            key={`${lineIndex}-${line.slice(0, 12)}`}
            className={isGreentext ? "text-emerald-600 dark:text-emerald-400" : undefined}
          >
            {parts.map((part, partIndex) => {
              if (/^>>\d+$/.test(part)) {
                const number = part.slice(2);
                return (
                  <Link
                    key={`${lineIndex}-${partIndex}`}
                    href={`/chan/${boardSlug}/thread/${threadId}#p${number}`}
                    className="font-medium text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                  >
                    {part}
                  </Link>
                );
              }

              return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
