import { getPackageDataForEditing } from "@/actions/package.action";
import { TourForm } from "@/components/forms/PackageForm";
import { notFound } from "next/navigation";

type EditPackagePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditPackagePage = async ({ params }: EditPackagePageProps) => {
  const { id } = await params;
  const packageData = await getPackageDataForEditing(id);

  if (!packageData) {
    notFound();
  }

  return (
    <div className="">
      <TourForm initialData={packageData} />
    </div>
  );
};

export default EditPackagePage;
