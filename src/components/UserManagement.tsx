import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "farmer", label: "Petani" },
  { value: "buyer", label: "Pembeli" },
];

const UserManagement = () => {
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, name, email, role, created_at");
      if (error) throw error;
      return data;
    },
  });

  // State untuk edit user
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "buyer" });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);

  // State untuk hapus user
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // State untuk pencarian
  const [search, setSearch] = useState("");

  // Open edit modal
  const handleEdit = (user: any) => {
    setEditUser(user);
    setEditForm({ name: user.name || "", role: user.role || "buyer" });
  };

  // Save edit
  const handleEditSave = async () => {
    setLoadingEdit(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: editForm.name, role: editForm.role })
      .eq("id", editUser.id);
    setLoadingEdit(false);
    if (error) {
      setNotif("Gagal update user!");
    } else {
      setNotif("User berhasil diupdate.");
      setEditUser(null);
      refetch();
    }
    setTimeout(() => setNotif(null), 2000);
  };

  // Hapus user
  const handleDelete = (user: any) => {
    setDeletingUser(user);
  };
  const handleDeleteConfirm = async () => {
    setLoadingDelete(true);
    const { error } = await supabase.from("profiles").delete().eq("id", deletingUser.id);
    setLoadingDelete(false);
    if (error) {
      setNotif("Gagal hapus user!");
    } else {
      setNotif("User berhasil dihapus.");
      setDeletingUser(null);
      refetch();
    }
    setTimeout(() => setNotif(null), 2000);
  };

  // Filter users berdasarkan pencarian
  const filteredUsers = users && search
    ? users.filter((user: any) =>
        (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Kelola Users</h2>
      {/* Search input */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="border rounded px-3 py-1 w-full max-w-xs"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {notif && <div className="mb-4 text-center text-sm text-green-600">{notif}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Tanggal Daftar</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.email || '-'}</td>
                    <td className="p-2 border">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="p-2 border">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                    <td className="p-2 border space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>Hapus</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4">Tidak ada user ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Edit User */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setEditUser(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Nama</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                disabled={loadingEdit}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Role</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={editForm.role}
                onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                disabled={loadingEdit}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleEditSave} disabled={loadingEdit}>
                {loadingEdit ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="outline" onClick={() => setEditUser(null)} disabled={loadingEdit}>
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setDeletingUser(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Hapus User</h3>
            <p>Yakin ingin menghapus user <b>{deletingUser.name}</b>?</p>
            <div className="flex gap-2 mt-4">
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loadingDelete}>
                {loadingDelete ? "Menghapus..." : "Hapus"}
              </Button>
              <Button variant="outline" onClick={() => setDeletingUser(null)} disabled={loadingDelete}>
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 