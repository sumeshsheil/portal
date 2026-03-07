"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { MessageSquare, Send, Pencil, Trash2, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  addLeadComment,
  updateLeadComment,
  deleteLeadComment,
} from "@/app/admin/(dashboard)/leads/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Comment {
  _id?: string;
  text: string;
  agentName: string;
  createdAt: Date | string;
}

interface LeadCommentsCardProps {
  leadId: string;
  comments: Comment[];
  disabled?: boolean;
}

export function LeadCommentsCard({
  leadId,
  comments,
  disabled,
}: LeadCommentsCardProps) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    startTransition(async () => {
      const result = await addLeadComment(leadId, newComment);
      if (result.success) {
        toast.success(result.message);
        setNewComment("");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editingText.trim()) return;

    startTransition(async () => {
      const result = await updateLeadComment(leadId, commentId, editingText);
      if (result.success) {
        toast.success(result.message);
        setEditingId(null);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    startTransition(async () => {
      const result = await deleteLeadComment(leadId, commentId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Agent Notes & Comments
          </CardTitle>
          <CardDescription>
            Internal notes and conversation history.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {!comments || comments.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
              No comments yet.
            </p>
          ) : (
            comments.map((comment, index) => {
              const id = comment._id || `temp-${index}`;
              const isEditing = editingId === id;

              return (
                <div
                  key={id}
                  className="group relative text-sm p-3.5 bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all shadow-sm"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="min-h-[80px] resize-none text-sm bg-background border-emerald-500 focus-visible:ring-emerald-500"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-slate-500"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-black"
                          onClick={() => handleUpdateComment(comment._id!)}
                          disabled={isPending}
                        >
                          {isPending ? "Saving..." : "Save Change"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => {
                            setEditingId(id);
                            setEditingText(comment.text);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this note? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteComment(comment._id!)
                                }
                                className="bg-rose-600 hover:bg-rose-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <p className="whitespace-pre-wrap pr-12 leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex items-center justify-end mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] text-slate-400 dark:text-slate-500">
                        <span>
                          {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment */}
        <div className="space-y-3 pt-2">
          <Textarea
            placeholder={
              disabled
                ? "You don't have access to this lead."
                : "Write an internal note..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={disabled || isPending}
            className="min-h-[100px] resize-none focus-visible:ring-emerald-500 bg-slate-50/50 dark:bg-slate-900/20"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || disabled || isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-black shadow-sm font-semibold h-10 px-6 rounded-lg"
            >
              {isPending ? (
                "Adding..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
