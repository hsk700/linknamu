// 실제 프로필과 링크가 준비되면 아래 더미 값을 교체하세요.
const profile = {
  name: "김클로",
  bio: "세계 최강 바이브코더",
  avatarUrl: "https://placehold.co/300x300/e7e5e4/44403c.png?text=Profile",
};

const links = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Blog", href: "https://example.com/" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen justify-center bg-white px-6 py-12 text-stone-900 sm:py-16">
      <div className="flex w-full max-w-sm flex-col items-center">
        <header className="flex w-full flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={`${profile.name}의 더미 프로필 사진`}
            width={160}
            height={160}
            className="h-40 w-40 rounded-full border-2 border-stone-200 object-cover"
          />
          <h1 className="mt-7 text-2xl font-bold tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600">
            {profile.bio}
          </p>
        </header>

        <nav aria-label="프로필 링크" className="mt-12 w-full">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-20 w-full items-center justify-center rounded-2xl border-2 border-stone-800 bg-white px-6 py-5 text-base font-semibold transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
