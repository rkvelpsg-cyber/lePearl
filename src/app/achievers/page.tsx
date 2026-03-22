import { Trophy, Award, Sparkles } from "lucide-react";

interface AchieverCardProps {
  name: string;
  examName: string;
  imageUrl: string;
  year?: string;
  subject?: string;
}

function AchieverCard({
  name,
  examName,
  imageUrl,
  year,
  subject,
}: AchieverCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute top-4 right-4 z-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-2 shadow-lg">
        <Trophy className="h-4 w-4 text-white" />
      </div>

      <div className="flex flex-col items-center p-6 text-center">
        <div className="relative mb-4">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-amber-400 shadow-lg">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <h3 className="mb-1 text-lg text-slate-800">{name}</h3>

        <div className="flex flex-col gap-1">
          <p className="rounded-full bg-blue-50 px-3 py-1 text-sm text-slate-600">
            {examName}
          </p>

          {(year || subject) && (
            <p className="mt-1 text-xs text-slate-500">
              {subject && <span>{subject}</span>}
              {subject && year && <span> • </span>}
              {year && <span>{year}</span>}
            </p>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600" />
    </div>
  );
}

interface Achiever {
  id: number;
  name: string;
  examName: string;
  imageUrl: string;
  year?: string;
  subject?: string;
}

interface AchieversSectionProps {
  title: string;
  achievers: Achiever[];
  showViewMore?: boolean;
}

function AchieversSection({
  title,
  achievers,
  showViewMore = true,
}: AchieversSectionProps) {
  return (
    <section className="w-full py-12">
      <div className="mb-10 flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500" />
        <Award className="h-6 w-6 text-amber-600" />
        <h2 className="text-3xl text-slate-800">{title}</h2>
        <Award className="h-6 w-6 text-amber-600" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {achievers.map((achiever) => (
          <AchieverCard
            key={achiever.id}
            name={achiever.name}
            examName={achiever.examName}
            imageUrl={achiever.imageUrl}
            year={achiever.year}
            subject={achiever.subject}
          />
        ))}
      </div>

      {showViewMore && (
        <div className="flex justify-center">
          <button className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg">
            View More Achievers
          </button>
        </div>
      )}
    </section>
  );
}

export default function AchieversPage() {
  const netAchievers = [
    {
      id: 1,
      name: "Nidhi Shukla",
      examName: "NTA-NET Dec 2025",
      imageUrl: "/Nidhi%20Shukla,%20NTA-NET%20Dec%202025.jpeg",
    },
    {
      id: 2,
      name: "Richa Singh",
      examName: "NTA-NET Dec 2026",
      imageUrl: "/Richa%20Singh_NET_Dec_2026.jpeg",
    },
    {
      id: 3,
      name: "Kanika Sharma",
      examName: "NTA-NET Dec 2025",
      imageUrl: "/Kanika%20Sharma.jpeg",
    },
    {
      id: 4,
      name: "Rashmita Sahoo",
      examName: "NTA-NET Dec 2024",
      imageUrl: "/Rashmita%20Sahoo.jpeg",
    },
    {
      id: 5,
      name: "Abhishesh Verma",
      examName: "NTA-NET Jun 2025",
      imageUrl: "/Abhishesh%20Verma.jpeg",
    },
    {
      id: 6,
      name: "Hemlata",
      examName: "NTA-NET Jun 2023",
      imageUrl: "/Hemlata.jpeg",
    },
    {
      id: 7,
      name: "Shabnam Khatun",
      examName: "NTA-NET Jun 2023",
      imageUrl: "/Shabnam%20Khatun.jpeg",
    },
    {
      id: 8,
      name: "Shivani Tiwari",
      examName: "NTA-NET JRF Dec 2024",
      imageUrl: "/Shivani%20Tiwari.jpeg",
    },
    {
      id: 9,
      name: "Vineeta Vijay Sharma",
      examName: "NTA-NET Dec 2022",
      imageUrl: "/Vineeta%20Vijay%20Sharma.jpeg",
    },
    {
      id: 10,
      name: "Alvina Parveen",
      examName: "NTA-NET Jun 2025",
      imageUrl: "/Alvina%20Parveen.jpeg",
    },
    {
      id: 11,
      name: "Brijesh Kumar Pal",
      examName: "NTA-NET Jan 2025",
      imageUrl: "/Brijesh%20Kumar%20Pal.jpeg",
    },
    {
      id: 12,
      name: "Akanksha Singham",
      examName: "NTA-NET Jan 2025",
      imageUrl: "/Akanksha%20Singham.jpeg",
    },
    {
      id: 13,
      name: "Neelu Patel",
      examName: "NTA-NET Jun 2023",
      imageUrl: "/Neelu%20Patel.jpeg",
    },
    {
      id: 14,
      name: "Deepti Dwivedi",
      examName: "NTA-NET Jun 2023",
      imageUrl: "/Deepti%20Dwivedi.jpeg",
    },
    {
      id: 15,
      name: "Revathy",
      examName: "NTA-NET Dec 2022",
      imageUrl: "/Revathy.jpeg",
    },
    {
      id: 16,
      name: "Namit Kumar",
      examName: "NTA-NET 2020",
      imageUrl: "/Namit%20Kumar.jpeg",
    },
    {
      id: 17,
      name: "Shyam Pal Singh",
      examName: "NTA-NET 2020",
      imageUrl: "/Shyam%20Pal%20Singh.jpeg",
    },
  ];

  const assistantProfessorAchievers = [
    {
      id: 1,
      name: "Soumya Panigrahi",
      examName: "Lecturer, Odisha Public Service Commission-2025",
      imageUrl:
        "/Soumya%20Panigrahi,%20Lecturer,%20Odisha%20Public%20Service%20Commission-2025.jpeg",
    },
    {
      id: 2,
      name: "Dr. Babli Mallick",
      examName:
        "Assistant Professor, Madhya Pradesh Public Service Commission-2025",
      imageUrl: "/babil_faculty2.jpeg",
    },
    {
      id: 3,
      name: "Mr Shubham Singh",
      examName: "Madhya Pradesh Public Service Commission-2025",
      imageUrl: "/Shubham%20Singh.jpeg",
    },
    {
      id: 4,
      name: "Asit Kumar Mohanty",
      examName: "Lecturer, SSB, Odhisha Public Service Commision 2024",
      imageUrl: "/Asit%20Kumar%20Mohanty.jpeg",
    },
    {
      id: 5,
      name: "Mr. Vishal Damahe",
      examName:
        "Assistant Professor, Madhya Pradesh Public Service Commision-2025",
      imageUrl: "/Vishal%20Damahe.jpeg",
    },
    {
      id: 6,
      name: "Ms Neelu Patel",
      examName:
        "Assistant Professor, Madhya Pradesh Public Service Commission- 2025",
      imageUrl: "/Neelu%20Patel.jpeg",
    },
    {
      id: 7,
      name: "Mr Balram Mishra",
      examName:
        "Assistant Professor, Madhya Pradesh Public Service Commission- 2025",
      imageUrl: "/Balram%20Mishra.jpeg",
    },
    {
      id: 8,
      name: "Dr. Ram Ballabh Sharma",
      examName: "Assistant Professor, RPSC Rank 13, 2025",
      imageUrl: "/Ram%20Ballabh%20Sharma.jpeg",
    },
    {
      id: 9,
      name: "Ms Rekha Bhati",
      examName: "Assistant Professor, RPSC Rank 11, 2025",
      imageUrl: "/Rekha%20Bhati.jpeg",
    },
    {
      id: 10,
      name: "Ms Sandhya Patel",
      examName: "Assistant Professor, UPHESC Adv 50-2022",
      imageUrl: "/Sandhya%20Patel.jpeg",
    },
    {
      id: 11,
      name: "Dr. Manju Bishnoi",
      examName: "Assistant Professor RPSC, Rank-11",
      imageUrl: "/Manju.jpeg",
    },
    {
      id: 12,
      name: "Dr. Ranjana Agarwal",
      examName: "Assistant Professor, RPSC-2021",
      imageUrl: "/Ranjana.jpeg",
    },
    {
      id: 13,
      name: "Ms Sunita Mohata",
      examName: "Assistant Professor, RPSC- 2022",
      imageUrl: "/Sunita%20Mohata.jpeg",
    },
    {
      id: 14,
      name: "Ms Priya Sharma",
      examName: "Assistant Professor, UPHESC Adv 50-2022",
      imageUrl: "/Priya%20sharma.jpeg",
    },
    {
      id: 15,
      name: "Ms Mahima Thakur",
      examName: "Assistant Professor, UPHESC Adv 50-2022",
      imageUrl: "/Mahima.jpeg",
    },
    {
      id: 16,
      name: "Ms Rashmi Verma",
      examName: "Assistant Professor, UPHESC Adv 50-2022",
      imageUrl: "/Rashmi%20verma.jpeg",
    },
    {
      id: 17,
      name: "Ms. Surbhi Satyabha",
      examName: "Assistant Professor, UPHESC-Adv 50-2022",
      imageUrl: "/Surbhi.jpeg",
    },
    {
      id: 18,
      name: "Dr. Amresh",
      examName: "Assistant Professor, UPHESC, Adv 50- 2022",
      imageUrl: "/Amresh.jpeg",
    },
    {
      id: 19,
      name: "Ms.Asha",
      examName: "Assistant Professor, UPHESC-Adv 50-2022",
      imageUrl: "/Asha.jpeg",
    },
    {
      id: 20,
      name: "Ms. Afroz Jahan",
      examName: "Assistant Professor, UPHESC, Adv 50- 2022",
      imageUrl: "/Afroz.jpeg",
    },
    {
      id: 21,
      name: "Ms. Anindita Bose",
      examName: "Assistant Professor, UPHESC-Adv 50-2022",
      imageUrl: "/Anindita%20Bose.jpeg",
    },
    {
      id: 22,
      name: "Shanta Surejya",
      examName: "Assistant Professor, UPHESC, Adv 50- 2022",
      imageUrl: "/Shanta%20Surejya.jpeg",
    },
    {
      id: 23,
      name: "Ms. Arju Mishra",
      examName: "Assistant Professor, UPHESC-Adv 50-2022",
      imageUrl: "/Arju%20Mishra.jpeg",
    },
    {
      id: 25,
      name: "Ms Mahima Singh, Assistant Professor, Himachal Pradesh Service Commision-2023",
      examName: "Assistant Professor, Himachal Pradesh Service Commision-2023",
      imageUrl: "/Mahima2.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50">
      <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-amber-400" />
            <h1 className="text-4xl text-white md:text-5xl">
              LePearl Achievers
            </h1>
            <Sparkles className="h-8 w-8 text-amber-400" />
          </div>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl">
            Celebrating the success of our brilliant students who qualified
            prestigious examinations.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <AchieversSection
          title="Assistant Professor Achievers"
          achievers={assistantProfessorAchievers}
        />

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="rounded-full border border-slate-200 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 px-6 py-2 text-slate-400">
              ★ ★ ★
            </span>
          </div>
        </div>

        <AchieversSection title="NTA NET Achievers" achievers={netAchievers} />
      </div>

      <div className="mt-16 h-2 w-full bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600" />
    </div>
  );
}
