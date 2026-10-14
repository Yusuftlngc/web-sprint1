import type { CampusEvent } from "../types/campus-event";

export const events: CampusEvent[] = [
  {
    id: "event-1",
    title: "Kariyer Günleri 2026",
    category: "Seminer",
    capacity: 120,
    date: "2026-10-12",
    time: "14:00",
    location: "A Blok Konferans Salonu",
    description: "Mezunlarla kariyer söyleşileri ve şirket stantları.",
    image: "/afis.svg"
  },

  {
    id: "event-2",
    title: "Robotik Atölyesi",
    category: "Atölye",
    capacity: 30,
    date: "2026-10-20",
    time: "13:00",
    location: "Lab 2",
    description: "Robotik sistemler ve temel uygulamalar.",
    image: "/afis.svg"
  },

  {
    id: "event-3",
    title: "Siber Güvenlik Söyleşisi",
    category: "Söyleşi",
    capacity: 80,
    date: "2026-10-27",
    time: "15:00",
    location: "B Blok Salon",
    description: "Siber güvenlik alanındaki güncel gelişmeler.",
    image: "/afis.svg"
  },

  {
    id: "event-4",
    title: "Yapay Zeka Semineri",
    category: "Seminer",
    capacity: 150,
    date: "2026-11-03",
    time: "14:30",
    location: "A Blok Konferans Salonu",
    description: "Yapay zeka ve güncel kullanım alanları.",
    image: "/afis.svg"
  },

  {
    id: "event-5",
    title: "Web Geliştirme Atölyesi",
    category: "Atölye",
    capacity: 40,
    date: "2026-11-10",
    time: "12:00",
    location: "Bilgisayar Laboratuvarı",
    description: "HTML, CSS ve JavaScript uygulamaları.",
    image: "/afis.svg"
  },

  {
    id: "event-6",
    title: "Mezunlarla Söyleşi",
    category: "Söyleşi",
    capacity: 100,
    date: "2026-11-17",
    time: "16:00",
    location: "C Blok Salon",
    description: "Mezun öğrencilerden sektör deneyimleri.",
    image: "/afis.svg"
  }
];