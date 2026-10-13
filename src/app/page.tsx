// 실제 프로필과 링크가 준비되면 아래 더미 값을 교체하세요.
import LinkList from "@/components/LinkList";

const profile = {
  name: "황성광",
  bio: "영진기술(주)",
  avatarUrl: "/profile.png",
};

const links = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Blog", href: "https://example.com/" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen justify-center bg-[#fff7ee] px-6 py-12 text-stone-900 sm:py-16">
      <div className="flex w-full max-w-sm flex-col items-center">
        <header className="flex w-full flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={`${profile.name}의 프로필 사진`}
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
          <LinkList links={links} />
        </nav>
      </div>
    </main>
  );
}
