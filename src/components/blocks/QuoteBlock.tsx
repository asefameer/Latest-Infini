interface QuoteBlockProps {
  quote: string;
  author: string;
  role?: string;
}

const QuoteBlock = ({ quote, author, role }: QuoteBlockProps) => (
  <section className="py-16 md:py-24 px-6">
    <div className="container mx-auto max-w-3xl text-center">
      <blockquote className="font-display text-2xl md:text-3xl font-light italic tracking-tight text-foreground/90 mb-8">
        "{quote}"
      </blockquote>
      <div>
        <p className="font-display font-semibold">{author}</p>
        {role && <p className="text-sm text-muted-foreground">{role}</p>}
      </div>
    </div>
  </section>
);

export default QuoteBlock;
