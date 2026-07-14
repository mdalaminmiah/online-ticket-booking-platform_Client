import { Bus, TrainFront, Ship, Plane, type LucideProps } from 'lucide-react';

const MAP = {
  Bus,
  Train: TrainFront,
  Launch: Ship,
  Plane,
} as const;

export function TransportIcon({ type, ...props }: { type: string } & LucideProps) {
  const Icon = MAP[type as keyof typeof MAP] ?? Bus;
  return <Icon {...props} />;
}
