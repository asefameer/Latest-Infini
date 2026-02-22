interface MediaGalleryProps {
  items: { src: string; alt: string; type?: 'image' | 'video' }[];
  columns?: 2 | 3;
}

const MediaGallery = ({ items, columns = 3 }: MediaGalleryProps) => (
  <section className="py-16 px-6">
    <div className={`container mx-auto grid gap-4 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl overflow-hidden aspect-[4/3] bg-muted">
          {item.type === 'video' ? (
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src={item.src} type="video/mp4" />
            </video>
          ) : (
            <img src={item.src} alt={item.alt} className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
      ))}
    </div>
  </section>
);

export default MediaGallery;
