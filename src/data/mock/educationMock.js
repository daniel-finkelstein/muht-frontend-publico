export const educationStatsMock = [
  { label: "Módulos completados", value: "9/12", progress: 75 },
  { label: "Videos vistos", value: "7/10", progress: 70 },
  { label: "Recursos descargados", value: "5", progress: 55 },
  { label: "Tiempo de estudio", value: "4.5h", progress: 80 },
];

export const educationModulesMock = [
  {
    id: 1,
    title: "Nutrición Postoperatoria",
    completed: 4,
    total: 5,
    lessons: [
      { title: "Fases de la alimentación", status: "completed" },
      { title: "Proteínas y su importancia", status: "completed" },
      { title: "Hidratación adecuada", status: "completed" },
      { title: "Suplementación vitamínica", status: "completed" },
      { title: "Manejo de intolerancias", status: "pending" },
    ],
  },
  {
    id: 2,
    title: "Actividad Física",
    completed: 3,
    total: 3,
    lessons: [
      { title: "Inicio de ejercicio post-cirugía", status: "completed" },
      { title: "Rutinas recomendadas", status: "completed" },
      { title: "Progresión del entrenamiento", status: "completed" },
    ],
  },
  {
    id: 3,
    title: "Aspectos Psicológicos",
    completed: 2,
    total: 4,
    lessons: [
      { title: "Adaptación emocional", status: "completed" },
      { title: "Relación con la comida", status: "completed" },
      { title: "Ansiedad y autocuidado", status: "pending" },
      { title: "Hábitos sostenibles", status: "pending" },
    ],
  },
];