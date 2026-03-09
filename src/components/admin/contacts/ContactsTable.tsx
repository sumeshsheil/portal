"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteContact } from "@/app/admin/(dashboard)/contacts/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

interface Contact {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
}

export function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Contact | null>(null);

  const handleDelete = async () => {
    if (!leadToDelete) return;
    
    setIsDeleting(leadToDelete._id);
    const result = await deleteContact(leadToDelete._id);
    setIsDeleting(null);
    setLeadToDelete(null);
    
    if (result.success) {
      toast.success("Lead deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete lead");
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Added On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No leads added yet.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    {contact.email && <span>{contact.email}</span>}
                    {contact.phone && <span className="text-muted-foreground">{contact.phone}</span>}
                    {!contact.email && !contact.phone && <span className="text-muted-foreground italic">No contact info</span>}
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate" title={contact.notes}>
                  {contact.notes || "-"}
                </TableCell>
                <TableCell>
                  {format(new Date(contact.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setLeadToDelete(contact)}
                    disabled={isDeleting === contact._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lead <strong>{leadToDelete?.name}</strong> and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              disabled={!!isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Lead"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
