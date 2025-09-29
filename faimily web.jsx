import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// FamilyConnector.jsx
// Extended: Default family, column layout, popup modal for adding members
// Animated introduction: "Welcome to my Family"

export default function FamilyConnector() {
  const [members, setMembers] = useState([
    { id: 1, name: "Nana", relation: "Eldest", avatar: null, root: true, branch: "grandparents" },
    { id: 2, name: "Nani", relation: "Grandmother", avatar: null, branch: "grandparents" },
    { id: 3, name: "Mother", relation: "Daughter of Nana", avatar: null, branch: "parents" },
    { id: 4, name: "Father", relation: "Son-in-law", avatar: null, branch: "parents" },
    { id: 5, name: "Aunt", relation: "Mother's Sister", avatar: null, branch: "parents" },
    { id: 6, name: "Uncle", relation: "Mother's Brother", avatar: null, branch: "parents" },
    { id: 7, name: "You", relation: "Self", avatar: null, branch: "siblings" },
    { id: 8, name: "Sibling", relation: "Brother/Sister", avatar: null, branch: "siblings" },
  ]);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [branch, setBranch] = useState("parents");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const containerRef = useRef(null);
  const nodeRefs = useRef({});

  function handleAddMember(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = Date.now();
    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMembers((prev) => [
          ...prev,
          { id, name: name.trim(), relation: relation.trim() || "Member", avatar: ev.target.result, branch },
        ]);
        resetForm();
      };
      reader.readAsDataURL(avatarFile);
    } else {
      setMembers((prev) => [
        ...prev,
        { id, name: name.trim(), relation: relation.trim() || "Member", avatar: null, branch },
      ]);
      resetForm();
    }
  }

  function resetForm() {
    setName("");
    setRelation("");
    setBranch("parents");
    setAvatarFile(null);
    setShowModal(false);
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (f) setAvatarFile(f);
  }

  function removeMember(id) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  const branches = [
    { key: "grandparents", label: "Grandparents" },
    { key: "parents", label: "Parents & Uncles/Aunts" },
    { key: "siblings", label: "Siblings & Cousins" },
    { key: "children", label: "Children" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Animated Intro */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Welcome to My Family
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-slate-600 mt-2"
          >
            A growing tree of love, connections, and generations.
          </motion.p>
        </motion.div>

        {/* Add Family Button */}
        <div className="text-center mb-8">
          <button
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-lg shadow-lg hover:bg-indigo-700"
            onClick={() => setShowModal(true)}
          >
            + Add Family Member
          </button>
        </div>

        {/* Family Columns */}
        <div className="bg-white p-6 rounded-2xl shadow relative">
          <div ref={containerRef} className="relative min-h-[500px] grid grid-cols-4 gap-4">
            {branches.map((b) => (
              <div key={b.key} className="flex flex-col gap-3 items-center">
                <h3 className="font-semibold text-sm mb-2">{b.label}</h3>
                <AnimatePresence>
                  {members.filter((m) => m.branch === b.key).map((m) => (
                    <motion.div
                      key={m.id}
                      ref={(el) => (nodeRefs.current[m.id] = el)}
                      layout
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`w-28 p-2 rounded-2xl bg-white border shadow-sm flex flex-col items-center text-center relative ${m.root ? "ring-4 ring-indigo-200" : ""}`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-slate-100">
                        {m.avatar ? (
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-slate-600 uppercase font-bold">{m.name.slice(0, 2)}</div>
                        )}
                      </div>
                      <div className="mt-1 font-semibold text-xs">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.relation}</div>
                      {!m.root && (
                        <button onClick={() => removeMember(m.id)} className="absolute top-1 right-1 text-[10px] px-1 py-0.5 rounded bg-rose-50 text-rose-600">x</button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Adding Members */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
              >
                <h2 className="text-lg font-semibold mb-4">Add a Family Member</h2>
                <form onSubmit={handleAddMember} className="space-y-3">
                  <div>
                    <label className="text-xs block mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Relation</label>
                    <input value={relation} onChange={(e) => setRelation(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Branch</label>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                      {branches.map((b) => (
                        <option key={b.key} value={b.key}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Avatar (optional)</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white text-sm">Add</button>
                    <button type="button" className="px-4 py-2 rounded border text-sm" onClick={resetForm}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
