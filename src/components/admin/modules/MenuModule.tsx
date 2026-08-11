"use client";

import { ReactNode, useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Field, NumberInput, Select, TextArea, TextInput, Toggle } from "../ui/controls";
import { Badge, EmptyState, Notice, PageHeader, SectionCard } from "../ui/panel";
import { SubTabs } from "../ui/SubTabs";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { SPICE_LEVELS } from "@/config/constants";
import {
  BotiData,
  BotiItem,
  FeaturedItem,
  MenuCategory,
  MenuItem,
  MenuRibbon,
  PlatterData,
  PlatterOption,
  SideItem,
  SpiceLevel,
} from "@/types";
import { Check, Pencil, Plus, Trash2, UtensilsCrossed, X } from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";

type MenuTabKey = "items" | "featured" | "platter" | "boti" | "sides";

const newId = (prefix: string) => `${prefix}-${Date.now()}`;

const spiceTone: Record<SpiceLevel, "neutral" | "gold" | "orange" | "red"> = {
  Mild: "neutral",
  Medium: "gold",
  Hot: "orange",
  "Extra Spicy": "red",
};

function MenuItemForm({
  value,
  categories,
  onChange,
  extra,
}: {
  value: MenuItem;
  categories: MenuCategory[];
  onChange: (next: MenuItem) => void;
  extra?: ReactNode;
}) {
  const set = <K extends keyof MenuItem>(key: K, val: MenuItem[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Field label="Title">
        <TextInput value={value.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Slug">
        <TextInput value={value.slug} onChange={(e) => set("slug", e.target.value)} />
      </Field>
      <Field label="Price (PKR)">
        <NumberInput
          value={value.price}
          onChange={(e) => set("price", Number(e.target.value) || 0)}
        />
      </Field>
      <Field label="Spice Level">
        <Select
          value={value.spice_level}
          onChange={(e) => set("spice_level", e.target.value as SpiceLevel)}
        >
          {SPICE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Category">
        <Select
          value={value.category_id}
          onChange={(e) => set("category_id", e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Image URL">
        <TextInput
          value={value.image_url}
          onChange={(e) => set("image_url", e.target.value)}
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="Description">
          <TextArea
            value={value.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-8 md:col-span-2">
        <Toggle
          checked={value.is_bestseller}
          onChange={(v) => set("is_bestseller", v)}
          label="Bestseller"
        />
        <Toggle
          checked={value.is_available}
          onChange={(v) => set("is_available", v)}
          label="Available"
        />
      </div>
      {extra}
    </div>
  );
}

function RibbonField({
  value,
  onChange,
}: {
  value: MenuRibbon | undefined;
  onChange: (value: MenuRibbon | undefined) => void;
}) {
  return (
    <Field label="Ribbon">
      <Select
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || undefined) as MenuRibbon | undefined)}
      >
        <option value="">No ribbon</option>
        <option value="Legendary">Legendary</option>
        <option value="Chef's Choice">Chef&apos;s Choice</option>
      </Select>
    </Field>
  );
}

function EditorHeader({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm" onClick={onSave}>
        <Check className="mr-1.5 h-3.5 w-3.5" /> Save
      </Button>
    </>
  );
}

export function MenuModule() {
  const { data } = useAdminData();
  const [tab, setTab] = useState<MenuTabKey>("items");

  const counts = {
    items: data.menu.items.length,
    featured: data.menu.featured.length,
    platter: undefined,
    boti: data.menu.boti.compact.length + 1,
    sides: data.menu.sides.length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Food Workspace"
        title="Menu"
        description="Every dish, platter option, spice level and availability flag on the menu."
      />

      <SubTabs
        activeId={tab}
        onChange={(id) => setTab(id as MenuTabKey)}
        tabs={[
          { id: "items", label: "Menu Items", count: counts.items },
          { id: "featured", label: "Featured", count: counts.featured },
          { id: "platter", label: "Build Platter" },
          { id: "boti", label: "Boti", count: counts.boti },
          { id: "sides", label: "Sides", count: counts.sides },
        ]}
      />

      {tab === "items" && <ItemsManager />}
      {tab === "featured" && <FeaturedManager />}
      {tab === "platter" && <PlatterManager />}
      {tab === "boti" && <BotiManager />}
      {tab === "sides" && <SidesManager />}
    </div>
  );
}

function ItemsManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [notice, setNotice] = useState<"saved" | "deleted" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MenuItem | null>(null);

  const items = data.menu.items;

  function commit(next: MenuItem[]) {
    updateSlice("menu", { ...data.menu, items: next });
  }
  function flash(type: "saved" | "deleted") {
    setNotice(type);
    setTimeout(() => setNotice(null), 2000);
  }
  function save() {
    if (!editing) return;
    const exists = items.some((i) => i.id === editing.id);
    commit(exists ? items.map((i) => (i.id === editing.id ? editing : i)) : [editing, ...items]);
    setEditing(null);
    flash("saved");
  }
  function toggle(item: MenuItem, key: "is_bestseller" | "is_available") {
    commit(items.map((i) => (i.id === item.id ? { ...i, [key]: !i[key] } : i)));
  }

  return (
    <div className="space-y-5">
      {notice ? (
        <Notice tone={notice === "saved" ? "success" : "danger"}>
          {notice === "saved" ? "Menu item saved." : "Menu item removed."}
        </Notice>
      ) : null}

      {editing ? (
        <SectionCard
          title={items.some((i) => i.id === editing.id) ? `Edit — ${editing.title}` : "Add Menu Item"}
          actions={
            <EditorHeader
              onSave={save}
              onCancel={() => setEditing(null)}
            />
          }
        >
          <MenuItemForm
            value={editing}
            categories={data.menu.categories}
            onChange={(next) => setEditing(next)}
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Menu Items"
        description="Full catalogue served on the menu page"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("menu"),
                category_id: data.menu.categories[0]?.id ?? "cat-1",
                title: "New Dish",
                slug: `new-dish-${Date.now()}`,
                description: "",
                price: 0,
                spice_level: "Medium",
                is_bestseller: false,
                is_available: true,
                image_url: "/images/menu/reshmi-tikka.jpg",
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Item
          </Button>
        }
      >
        {items.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No menu items"
            description="Add your first dish to get the grill started."
          />
        ) : (
          <ul className="divide-y divide-[var(--border-warm)]">
            {items.map((item) => {
              const category = data.menu.categories.find((c) => c.id === item.category_id);
              return (
                <li key={item.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--text-faint)]">{item.slug}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{category?.name ?? "Uncategorised"}</Badge>
                      <Badge tone={spiceTone[item.spice_level]}>
                        {item.spice_level}
                      </Badge>
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Toggle
                        checked={item.is_bestseller}
                        onChange={() => toggle(item, "is_bestseller")}
                        label="Best"
                      />
                      <Toggle
                        checked={item.is_available}
                        onChange={() => toggle(item, "is_available")}
                        label="Live"
                      />
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => setEditing({ ...item })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this menu item?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the menu catalogue. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit(items.filter((i) => i.id !== pendingDelete.id));
            flash("deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function FeaturedManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<FeaturedItem | null>(null);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<FeaturedItem | null>(null);

  const featured = data.menu.featured;

  function commit(next: FeaturedItem[]) {
    updateSlice("menu", { ...data.menu, featured: next });
  }
  function save() {
    if (!editing) return;
    const exists = featured.some((i) => i.id === editing.id);
    commit(exists ? featured.map((i) => (i.id === editing.id ? editing : i)) : [editing, ...featured]);
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Featured item saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={featured.some((i) => i.id === editing.id) ? `Edit — ${editing.title}` : "Add Featured Item"}
          actions={<EditorHeader onSave={save} onCancel={() => setEditing(null)} />}
        >
          <MenuItemForm
            value={editing}
            categories={data.menu.categories}
            onChange={(next) => setEditing((d) => (d ? { ...d, ...next } : d))}
            extra={
              <div className="grid grid-cols-1 gap-5 md:col-span-2 md:grid-cols-2">
                <RibbonField
                  value={editing.ribbon}
                  onChange={(ribbon) => setEditing((d) => (d ? { ...d, ribbon } : d))}
                />
                <Field label="Tags (comma separated)">
                  <TextInput
                    value={editing.tags?.join(", ") ?? ""}
                    onChange={(e) =>
                      setEditing((d) =>
                        d
                          ? {
                              ...d,
                              tags: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            }
                          : d,
                      )
                    }
                  />
                </Field>
              </div>
            }
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Featured Items"
        description="The hero dishes shown first on the menu page"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("featured"),
                category_id: data.menu.categories[0]?.id ?? "cat-1",
                title: "New Featured",
                slug: `new-featured-${Date.now()}`,
                description: "",
                price: 0,
                spice_level: "Medium",
                is_bestseller: false,
                is_available: true,
                image_url: "/images/menu/reshmi-tikka.jpg",
                tags: [],
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Featured
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {featured.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {item.ribbon ? <Badge tone="gold">{item.ribbon}</Badge> : null}
                  {item.tags?.map((tag) => (
                    <Badge key={tag} tone="peach">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {formatCurrency(item.price)}
                </span>
                <Toggle
                  checked={item.is_available}
                  onChange={(v) =>
                    commit(featured.map((i) => (i.id === item.id ? { ...i, is_available: v } : i)))
                  }
                  label="Live"
                />
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...item, tags: [...(item.tags ?? [])] })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this featured item?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the menu highlights. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit(featured.filter((i) => i.id !== pendingDelete.id));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function PlatterManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<PlatterData>(data.menu.platter);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    { list: "meats" | "sides"; option: PlatterOption } | null
  >(null);

  function save() {
    updateSlice("menu", { ...data.menu, platter: draft });
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  function addOption(list: "meats" | "sides") {
    setDraft({
      ...draft,
      [list]: [...draft[list], { id: newId(list), name: "New Option", price: 0 }],
    });
  }
  function patchOption(list: "meats" | "sides", id: string, patch: Partial<PlatterOption>) {
    setDraft({
      ...draft,
      [list]: draft[list].map((o) => (o.id === id ? { ...o, ...patch } : o)),
    });
  }

  function renderOptions(list: "meats" | "sides") {
    return (
      <ul className="space-y-2">
        {draft[list].map((option) => (
          <li key={option.id} className="flex items-center gap-2">
            <TextInput
              value={option.name}
              onChange={(e) => patchOption(list, option.id, { name: e.target.value })}
              className="flex-1"
            />
            <NumberInput
              value={option.price}
              onChange={(e) => patchOption(list, option.id, { price: Number(e.target.value) || 0 })}
              className="w-32"
            />
            <Button size="sm" variant="ghost" onClick={() => setPendingDelete({ list, option })}>
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Platter configuration saved.</Notice> : null}

      <SectionCard
        title="Build Your Platter"
        description="Base price and the meat / side options customers can add"
        actions={
          <>
            <Button size="sm" variant="ghost" onClick={() => setDraft(data.menu.platter)}>
              Discard
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save Platter
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Field label="Base Label">
            <TextInput value={draft.baseLabel} onChange={(e) => setDraft({ ...draft, baseLabel: e.target.value })} />
          </Field>
          <Field label="Base Price (PKR)">
            <NumberInput value={draft.basePrice} onChange={(e) => setDraft({ ...draft, basePrice: Number(e.target.value) || 0 })} />
          </Field>
          <Field label="Image URL">
            <TextInput value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard
          title="Meats"
          actions={
            <Button size="sm" variant="outline" onClick={() => addOption("meats")}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Meat
            </Button>
          }
        >
          {renderOptions("meats")}
        </SectionCard>
        <SectionCard
          title="Sides"
          actions={
            <Button size="sm" variant="outline" onClick={() => addOption("sides")}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Side
            </Button>
          }
        >
          {renderOptions("sides")}
        </SectionCard>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this platter option?"
        description={
          pendingDelete
            ? `"${pendingDelete.option.name}" will no longer be available to platter builders. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            setDraft({
              ...draft,
              [pendingDelete.list]: draft[pendingDelete.list].filter(
                (o) => o.id !== pendingDelete.option.id,
              ),
            });
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function BotiManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<BotiItem | null>(null);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BotiItem | null>(null);

  const boti = data.menu.boti;

  function commit(next: BotiData) {
    updateSlice("menu", { ...data.menu, boti: next });
  }
  function saveFeatured() {
    if (!editing) return;
    commit({ ...boti, featured: editing });
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }
  function patchCompact(id: string, patch: Partial<BotiItem>) {
    commit({
      ...boti,
      compact: boti.compact.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });
  }
  function addCompact() {
    commit({
      ...boti,
      compact: [
        {
          id: newId("boti"),
          category_id: boti.featured.category_id,
          title: "New Boti",
          slug: `new-boti-${Date.now()}`,
          description: "",
          price: 0,
          spice_level: "Medium",
          is_bestseller: false,
          is_available: true,
          image_url: "/images/menu/bharli-boti.jpg",
        },
        ...boti.compact,
      ],
    });
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Featured boti saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={`Edit — ${editing.title}`}
          actions={<EditorHeader onSave={saveFeatured} onCancel={() => setEditing(null)} />}
        >
          <MenuItemForm
            value={editing}
            categories={data.menu.categories}
            onChange={(next) => setEditing((d) => (d ? { ...d, ...next } : d))}
            extra={
              <div className="md:col-span-2 md:max-w-xs">
                <RibbonField
                  value={editing.ribbon}
                  onChange={(ribbon) => setEditing((d) => (d ? { ...d, ribbon } : d))}
                />
              </div>
            }
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Featured Boti"
        description="The flagship bharli boti shown on the menu page"
        actions={
          <Button size="sm" variant="outline" onClick={() => setEditing({ ...boti.featured })}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit Featured
          </Button>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
              {boti.featured.title}
            </p>
            {boti.featured.ribbon ? (
              <Badge tone="gold" className="mt-1">{boti.featured.ribbon}</Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[var(--text-primary)]">
              {formatCurrency(boti.featured.price)}
            </span>
            <Badge tone={spiceTone[boti.featured.spice_level]}>
              {boti.featured.spice_level}
            </Badge>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Compact Boti"
        description="Secondary boti variants listed under the featured dish"
        actions={
          <Button size="sm" variant="outline" onClick={addCompact}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Boti
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {boti.compact.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                <p className="text-xs text-[var(--text-faint)]">{item.slug}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={spiceTone[item.spice_level]}>{item.spice_level}</Badge>
                <NumberInput
                  value={item.price}
                  onChange={(e) => patchCompact(item.id, { price: Number(e.target.value) || 0 })}
                  className="w-28"
                />
                <Toggle
                  checked={item.is_available}
                  onChange={(v) => patchCompact(item.id, { is_available: v })}
                  label="Live"
                />
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...item })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this boti?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the boti list. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit({ ...boti, compact: boti.compact.filter((b) => b.id !== pendingDelete.id) });
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function SidesManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<SideItem | null>(null);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SideItem | null>(null);

  const sides = data.menu.sides;

  function commit(next: SideItem[]) {
    updateSlice("menu", { ...data.menu, sides: next });
  }
  function save() {
    if (!editing) return;
    const exists = sides.some((i) => i.id === editing.id);
    commit(exists ? sides.map((i) => (i.id === editing.id ? editing : i)) : [editing, ...sides]);
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }
  function toggleSignature(item: SideItem) {
    commit(sides.map((i) => (i.id === item.id ? { ...i, isSignature: !i.isSignature } : i)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Side saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={sides.some((i) => i.id === editing.id) ? `Edit — ${editing.title}` : "Add Side"}
          actions={<EditorHeader onSave={save} onCancel={() => setEditing(null)} />}
        >
          <MenuItemForm
            value={editing}
            categories={data.menu.categories}
            onChange={(next) => setEditing((d) => (d ? { ...d, ...next } : d))}
            extra={
              <div className="md:col-span-2">
                <Toggle
                  checked={!!editing.isSignature}
                  onChange={(v) => setEditing((d) => (d ? { ...d, isSignature: v } : d))}
                  label="Signature item"
                  description="Highlights this side across the menu"
                />
              </div>
            }
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Sides & Sauces"
        description="Garlic naan, masala fries and the rest"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("side"),
                category_id: "cat-4",
                title: "New Side",
                slug: `new-side-${Date.now()}`,
                description: "",
                price: 0,
                spice_level: "Mild",
                is_bestseller: false,
                is_available: true,
                image_url: "/images/menu/garlic-naan.jpg",
                isSignature: false,
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Side
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {sides.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {item.title}
                  {item.isSignature ? (
                    <span className="ml-2"><Badge tone="gold">Signature</Badge></span>
                  ) : null}
                </p>
                <p className="text-xs text-[var(--text-faint)]">{item.slug}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={spiceTone[item.spice_level]}>{item.spice_level}</Badge>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {formatCurrency(item.price)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Toggle checked={!!item.isSignature} onChange={() => toggleSignature(item)} label="Sig" />
                <Toggle
                  checked={item.is_available}
                  onChange={(v) => commit(sides.map((i) => (i.id === item.id ? { ...i, is_available: v } : i)))}
                  label="Live"
                />
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => setEditing({ ...item })}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this side?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the sides & sauces list. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit(sides.filter((i) => i.id !== pendingDelete.id));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
