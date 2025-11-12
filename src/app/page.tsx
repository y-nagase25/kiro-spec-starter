import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-[800px] mx-auto">
        <TodoList />
      </div>
    </main>
  );
}
