import Loader from "@/components/Loader/Loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Loader color="#FFFFFF" />
    </div>
  );
}