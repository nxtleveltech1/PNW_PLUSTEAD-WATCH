"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/db";
import {
  adminDocumentSchema,
  adminDocumentCategorySchema,
  type AdminDocumentInput,
  type AdminDocumentCategoryInput,
} from "@/lib/schemas";

export async function createDocumentCategory(input: AdminDocumentCategoryInput) {
  await requireAdmin();
  const parsed = adminDocumentCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await prisma.documentCategory.create({ data: { name: parsed.data.name } });
  revalidatePath("/admin");
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  return { ok: true as const };
}

export async function deleteDocumentCategory(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  await requireAdmin();
  const count = await prisma.document.count({ where: { categoryId: id } });
  if (count > 0) {
    return { ok: false as const, message: "Cannot delete category with documents. Move or delete documents first." };
  }
  await prisma.documentCategory.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  return { ok: true as const };
}

export async function createDocument(input: AdminDocumentInput) {
  await requireAdmin();
  const parsed = adminDocumentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await prisma.document.create({
    data: {
      name: parsed.data.name,
      categoryId: parsed.data.categoryId,
      fileUrl: parsed.data.fileUrl,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  return { ok: true as const };
}

export async function updateDocument(id: string, input: AdminDocumentInput) {
  await requireAdmin();
  const parsed = adminDocumentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await prisma.document.update({
    where: { id },
    data: {
      name: parsed.data.name,
      categoryId: parsed.data.categoryId,
      fileUrl: parsed.data.fileUrl,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  return { ok: true as const };
}

export async function deleteDocument(id: string) {
  await requireAdmin();
  await prisma.document.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
}
