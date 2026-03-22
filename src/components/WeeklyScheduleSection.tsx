import { BookOpen, GraduationCap } from "lucide-react";

interface ScheduleEvent {
  day: string;
  timeSlot: string;
  course: string;
  color: keyof typeof colorClasses;
}

const scheduleData: ScheduleEvent[] = [
  {
    day: "Sunday",
    timeSlot: "9:00 - 12:00 Noon",
    course: "NLP",
    color: "pink",
  },
  {
    day: "Monday",
    timeSlot: "8:00 - 9:45 PM",
    course: "UPHESC",
    color: "blue",
  },
  {
    day: "Monday",
    timeSlot: "9:00 - 10:00 PM",
    course: "MPPSC",
    color: "green",
  },
  {
    day: "Tuesday",
    timeSlot: "7:45 - 9:00 PM",
    course: "NET",
    color: "purple",
  },
  {
    day: "Wednesday",
    timeSlot: "7:45 - 9:00 PM",
    course: "LT Grade",
    color: "orange",
  },
  {
    day: "Wednesday",
    timeSlot: "8:00 - 9:45 PM",
    course: "UPHESC",
    color: "blue",
  },
  {
    day: "Wednesday",
    timeSlot: "9:00 - 10:00 PM",
    course: "MPPSC",
    color: "green",
  },
  {
    day: "Thursday",
    timeSlot: "7:45 - 9:00 PM",
    course: "NET",
    color: "purple",
  },
  { day: "Friday", timeSlot: "7:45 - 9:00 PM", course: "LT", color: "orange" },
  {
    day: "Friday",
    timeSlot: "8:00 - 9:45 PM",
    course: "UPHESC",
    color: "blue",
  },
  {
    day: "Friday",
    timeSlot: "9:00 - 10:00 PM",
    course: "MPPSC",
    color: "green",
  },
  {
    day: "Saturday",
    timeSlot: "7:45 - 9:00 PM",
    course: "NET",
    color: "purple",
  },
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeSlots = [
  "9:00 - 12:00 Noon",
  "7:45 - 9:00 PM",
  "8:00 - 9:45 PM",
  "9:00 - 10:00 PM",
];

const colorClasses = {
  purple: "bg-purple-100 border-purple-300 hover:bg-purple-200",
  blue: "bg-blue-100 border-blue-300 hover:bg-blue-200",
  green: "bg-green-100 border-green-300 hover:bg-green-200",
  orange: "bg-orange-100 border-orange-300 hover:bg-orange-200",
  pink: "bg-pink-100 border-pink-300 hover:bg-pink-200",
};

const badgeColorClasses = {
  purple: "bg-purple-600 text-white",
  blue: "bg-blue-600 text-white",
  green: "bg-green-600 text-white",
  orange: "bg-orange-600 text-white",
  pink: "bg-pink-600 text-white",
};

export function WeeklyScheduleSection() {
  const getEventsForCell = (day: string, timeSlot: string) => {
    return scheduleData.filter(
      (event) => event.day === day && event.timeSlot === timeSlot,
    );
  };

  return (
    <section
      id="weekly-schedule"
      className="w-full px-4 py-16 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #14532d 0%, #166534 38%, #b91c1c 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/20 p-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white">
            Weekly Class Schedule
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-emerald-50">
            Stay updated with our weekly academic sessions designed to help you
            succeed in competitive exams.
          </p>
        </div>

        <div className="mb-8 hidden rounded-3xl bg-white p-6 shadow-2xl md:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="rounded-tl-2xl border-b-2 border-gray-200 bg-[#EEF2FF] p-4 text-left font-semibold text-[#1E3A8A]">
                    Time
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border-b-2 border-gray-200 bg-[#EEF2FF] p-4 text-center font-semibold text-[#1E3A8A]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="border-b border-gray-100">
                    <td className="whitespace-nowrap bg-gray-50 p-4 font-medium text-gray-700">
                      {timeSlot}
                    </td>
                    {days.map((day) => {
                      const events = getEventsForCell(day, timeSlot);
                      return (
                        <td key={`${day}-${timeSlot}`} className="p-2">
                          {events.length > 0 ? (
                            <div className="space-y-2">
                              {events.map((event, index) => (
                                <div
                                  key={`${event.course}-${index}`}
                                  className={`${colorClasses[event.color]} cursor-pointer rounded-xl border-2 p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span
                                      className={`${badgeColorClasses[event.color]} rounded-full px-3 py-1 text-sm font-semibold`}
                                    >
                                      {event.course}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-16" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8 space-y-6 md:hidden">
          {days.map((day) => {
            const dayEvents = scheduleData.filter((event) => event.day === day);
            if (dayEvents.length === 0) {
              return null;
            }

            return (
              <div
                key={day}
                className="overflow-hidden rounded-2xl bg-white shadow-lg"
              >
                <div className="bg-[#1E3A8A] p-4 text-white">
                  <h3 className="text-xl font-bold">{day}</h3>
                </div>
                <div className="space-y-3 p-4">
                  {dayEvents.map((event, index) => (
                    <div
                      key={`${event.course}-${index}`}
                      className={`${colorClasses[event.color]} rounded-xl border-2 p-4`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span
                          className={`${badgeColorClasses[event.color]} rounded-full px-3 py-1 text-sm font-semibold`}
                        >
                          {event.course}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{event.timeSlot}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {[
            { course: "NET", color: "purple" },
            { course: "UPHESC", color: "blue" },
            { course: "MPPSC", color: "green" },
            { course: "LT", color: "orange" },
            { course: "NLP", color: "pink" },
          ].map((item) => (
            <div key={item.course} className="flex items-center gap-2">
              <div
                className={`h-4 w-4 rounded-full ${badgeColorClasses[item.color as keyof typeof badgeColorClasses]}`}
              />
              <span className="text-sm font-medium text-white">
                {item.course}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
