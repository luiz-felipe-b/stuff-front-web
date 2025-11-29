"use client";

import React, { useEffect, useState } from "react";
import { userApi } from "@/services/api";
import Loader from "@/components/Loader/Loader";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { toast } from "react-hot-toast";
import { Check, LetterText, Mail, Pencil, UserIcon, X } from "lucide-react";

interface ProfileModalProps {
    userId: string;
    open: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ userId, open, onClose }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<any>({});

    useEffect(() => {
        if (!open) return;
        async function fetchUser() {
            setLoading(true);
            setError(null);
            if (!userId) {
                setError("nenhum usuário especificado");
                setLoading(false);
                return;
            }
            try {
                const token = localStorage.getItem("token");
                const resp = await userApi.getUsersme({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
                setUser(resp.data);
                setForm(resp.data);
            } catch (err: any) {
                setError("usuário não encontrado.");
            }
            setLoading(false);
        }
        fetchUser();
    }, [userId, open]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    function handleEdit() {
        setEditMode(true);
    }
    function handleCancel() {
        setEditMode(false);
        setForm(user);
    }
    async function handleSave() {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            await userApi.patchUsersId({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
            }, {
                params: { id: userId },
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setUser(form);
            setEditMode(false);
            toast.success("perfil atualizado com sucesso.");
        } catch (err: any) {
            setError("Erro ao salvar alterações.");
        }
        setLoading(false);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40">
            <div className="bg-stuff-white rounded-xl p-6 flex flex-col gap-4 border-2 border-stuff-light shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] relative">
                <div className="flex mb-4">
                    <UserIcon size={24} className="text-stuff-light" />
                    <span className="text-lg text-stuff-light font-extrabold ml-2">Perfil</span>
                </div>
                <button className="absolute top-4 right-4 text-stuff-light cursor-pointer hover:bg-stuff-mid/20 rounded-4xl p-2" onClick={onClose}>
                    <X size={24} /> 
                </button>
                {loading ? (
                    <Loader label="Carregando perfil..." />
                ) : (
                    <>
                        <div className="flex gap-16">
                            <span className="w-63 h-63 flex items-center justify-center rounded-full bg-stuff-light text-stuff-white font-bold text-8xl mx-auto mb-4">
                                {`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || <UserIcon size={32} />}
                            </span>
                            <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
                                <div className="w-full flex gap-2">
                                    <div>
                                        <label className="w-24 text-stuff-light font-semibold">nome</label>
                                        <Input
                                            type="text"
                                            name="firstName"
                                            value={form?.firstName || ""}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            placeholder="nome"
                                            icon={<LetterText size={16} />}
                                        />
                                    </div>
                                    <div>
                                        <label className="w-24 text-stuff-light font-semibold">sobrenome</label>
                                        <Input
                                            type="text"
                                            name="lastName"
                                            value={form?.lastName || ""}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            placeholder="sobrenome"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-stuff-light font-semibold">nome de usuário</label>
                                    <Input
                                        type="text"
                                        name="userName"
                                        value={form?.userName || ""}
                                        onChange={handleChange}
                                        disabled
                                        placeholder="usuário"
                                        icon={<UserIcon size={16} />}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-stuff-light font-semibold">e-mail</label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={form?.email || ""}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        placeholder="e-mail"
                                        icon={<Mail size={16} />}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6 justify-end">
                            {!editMode ? (
                                <>
                                    <Button palette="danger" variant="primary" size="md" onClick={onClose}>
                                        fechar
                                    </Button>
                                    <Button palette="default" variant="primary" title="editar" size="md" onClick={handleEdit}>
                                        editar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button palette="danger" variant="primary" size="md" onClick={handleCancel}>
                                        cancelar
                                    </Button>
                                    <Button palette="success" variant="primary" size="md" onClick={handleSave}>
                                        salvar
                                    </Button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
