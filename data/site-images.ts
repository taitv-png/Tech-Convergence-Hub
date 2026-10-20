/* Swap local image paths here when TCH photography is ready. */
export const referenceImages = {
  robotics: {
    src: "/images/references/robotics.webp",
    alt: "Bàn tay robot minh họa sự kết nối giữa công nghệ và con người",
    credit: "ThisisEngineering / Unsplash",
    source: "https://unsplash.com/photos/sbVu5zitZt0",
    label: "Robotics & Con người",
  },
  immersive: {
    src: "/images/references/immersive.webp",
    alt: "Người tham gia nghiên cứu trải nghiệm thiết bị thực tế ảo",
    credit: "Navy Medicine / Unsplash",
    source:
      "https://unsplash.com/photos/person-wearing-a-virtual-reality-headset-and-headphones-yrqz5wHz75w",
    label: "Công nghệ nhập vai",
  },
  urban: {
    src: "/images/references/urban-hcmc.webp",
    alt: "Hạ tầng đô thị, sông và cầu tại TP. Hồ Chí Minh nhìn từ trên cao",
    credit: "Marvin Tendies / Unsplash",
    source:
      "https://unsplash.com/photos/aerial-view-of-a-city-with-a-river-and-bridges-IwzvkB8ZQYo",
    label: "Đô thị & Dữ liệu",
  },
} as const;
export function imageForCluster(cluster: string) {
  if (/Robot|Tự động hóa/.test(cluster)) return referenceImages.robotics;
  if (/nhập vai/.test(cluster)) return referenceImages.immersive;
  if (/Đô thị|Biển/.test(cluster)) return referenceImages.urban;
  return undefined;
}

/* Architectural design renders from the wayfinding source, keyed by room. Not photographs. */
export const roomRenders: Record<string, string> = {
  E104: "/rooms/e104/134.jpg",
  E102: "/rooms/e102/102.jpg",
  E401: "/rooms/e401/144.jpg",
};
