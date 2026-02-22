interface EditorialTextProps {
  heading: string;
  body: string;
  align?: 'left' | 'center';
  size?: 'default' | 'large';
}

const EditorialText = ({ heading, body, align = 'center', size = 'default' }: EditorialTextProps) => (
  <section className={`py-16 md:py-24 px-6 ${align === 'center' ? 'text-center' : ''}`}>
    <div className={`container mx-auto ${align === 'center' ? 'max-w-3xl' : 'max-w-5xl'}`}>
      <h2 className={`font-display font-bold tracking-tight mb-6 ${size === 'large' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl'}`}>
        {heading}
      </h2>
      <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">{body}</p>
    </div>
  </section>
);

export default EditorialText;
