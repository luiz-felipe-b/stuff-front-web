import React, { useState } from "react";
import PaginationControls from "../PaginationControls/PaginationControls";
import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import { ListItem } from "@/components/list";
import DeleteOrganizationModal from "@/components/OrganizationList/DeleteOrganizationModal";
import { Building, Search, Trash } from "lucide-react";
import Input from "@/components/Input/Input";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface OrganizationListProps {
  organizations: Organization[];
  loading: boolean;
  onSelect: (org: Organization) => void;
  onDelete: (org: Organization) => void;
  showDeleteModal: boolean;
  selectedOrg: Organization | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => Promise<void>;
}


const ITEMS_PER_PAGE = 10;

const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  loading,
  onSelect,
  onDelete,
  showDeleteModal,
  selectedOrg,
  onCancelDelete,
  onConfirmDelete,
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Filter organizations by search
  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    (org.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const totalPages = Math.ceil(filteredOrgs.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrgs = filteredOrgs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Reset to page 1 if orgs change and current page is out of range
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filteredOrgs, totalPages]);

  return (
    <div className="flex flex-col gap-4 w-full overflow-y-auto">
      {/* Search Bar */}
      <div className="flex flex-row items-center gap-2 mb-2">
        <Input
          type="text"
          className="flex-1"
          placeholder="buscar organização por nome"
          icon={<Search />}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      {loading ? (
        <Loader label="Carregando organizações..." />
      ) : filteredOrgs.length === 0 ? (
        <div className="text-center text-stuff-gray-100 py-8">Nenhuma organização encontrada.</div>
      ) : (
        paginatedOrgs.map((org) => (
          <div
            key={org.id}
            className="relative bg-white border-2 border-stuff-mid rounded-xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] p-5 cursor-pointer hover:bg-stuff-high/20 transition group flex"
            onClick={() => onSelect(org)}
          >
            {/* <Button
              variant="primary"
              palette="danger"
              size="sm"
              iconBefore={<Trash />}
              className="absolute top-3 right-3 opacity-80 group-hover:opacity-100"
              title="Deletar organização"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(org);
              }}
            /> */}
            <Building
              className="mr-4 text-stuff-mid"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-xl text-stuff-black truncate mb-1">{org.name}</span>
              <span className="text-stuff-dark text-base truncate mb-2">{org.description}</span>
              <span className="text-xs text-stuff-mid">ID: {org.id}</span>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={handlePageChange} />

      <DeleteOrganizationModal
        open={showDeleteModal && !!selectedOrg}
        orgName={selectedOrg?.name || ''}
        loading={loading}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};

export default OrganizationList;
