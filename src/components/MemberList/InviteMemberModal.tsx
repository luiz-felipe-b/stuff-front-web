import React, { useState } from "react";
import Input from "@/components/Input/Input";
import OptionTokenList from "@/components/OptionTokenList/OptionTokenList";
import Button from "@/components/Button/Button";
import toast from "react-hot-toast";
import { organizationsApi } from "@/services/api";
import { Mail, Plus, X } from "lucide-react";
import Loader from "../Loader/Loader";

interface InviteMemberModalProps {
    open: boolean;
    onClose: () => void;
    organizationId: string;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ open, onClose, organizationId }) => {
    const [emailInput, setEmailInput] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    function handleAddEmail() {
        const email = emailInput.trim().toLowerCase();
        if (!email || emails.includes(email)) return;
        setEmails([...emails, email]);
        setEmailInput("");
    }

    function handleRemoveEmail(email: string) {
        setEmails(emails.filter(e => e !== email));
    }

    async function handleSendInvites() {
        setLoading(true);
        try {
            await Promise.all(
                emails.map(email =>
                    organizationsApi.postOrganizationsinviteMember({ email, organizationId })
                )
            );
            toast.success("Convites enviados!");
            setEmails([]);
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Erro ao enviar convites");
        }
        setLoading(false);
    }

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40">
            <div className="flex flex-col gap-6 p-6 w-full max-w-2xl bg-stuff-white rounded-2xl border-2 border-stuff-light shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] relative" onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-stuff-light hover:bg-stuff-mid/20 rounded-full p-2 transition cursor-pointer" onClick={onClose}>
                    <X size={22} />
                </button>
                <div className="flex gap-2 items-center">
                    <Mail className="text-stuff-light" />
                    <div className="text-lg text-stuff-light font-extrabold">Convidar membros</div>
                </div>

                <div className="flex gap-2">
                    <Input
                        id="invite-email"
                        type="email"
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleAddEmail(); }}
                        placeholder="digite o e-mail"
                        icon={<Mail className="text-stuff-light text-lg" />}
                        disabled={loading}
                        className="w-full"
                    />
                    <Button palette="success" size="md" onClick={handleAddEmail} disabled={!emailInput || loading}>
                        <Plus size={24} />
                    </Button>
                </div>

                {emails.length > 0 && (
                    <OptionTokenList options={emails} value="" onRemove={handleRemoveEmail} />
                )}
                <div className="flex flex-col gap-2">
                    <Button
                        palette="success"
                        size="md"
                        fullWidth
                        loading={loading}
                        disabled={emails.length === 0 || loading}
                        onClick={handleSendInvites}
                    >
                        {loading ? <Loader size={24} color="#FFFFFF" /> : emails.length > 0 ? emails.length === 1 ? "enviar convite" : "enviar convites" : "nenhum e-mail adicionado"}
                    </Button>
                    <Button palette="danger" size="md" fullWidth onClick={onClose} disabled={loading}>
                        cancelar
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default InviteMemberModal;
