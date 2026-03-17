// import { API_ENDPOINTS } from '@/api/apiEndpoints';
// import { apiInstance } from '@/api/apiInstance';
// import { BaseDialog, ModalFooter, ModalHeader } from '@/components/modal';
// import { Button, FormField, Icon, Input } from '@/components/ui';
// import { COURSE_TAG_OPTIONS, CURRENCY_OPTIONS } from '@/helpers/createModalVars';
// import { ICON_NAMES } from '@/helpers/iconNames';
// import {
//   CreateCourseModalProps,
//   ModuleItem,
// } from '@/types/features/manag-course/AddCourseModal.types';
// import React, { useCallback, useMemo, useState } from 'react';
// const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [language] = useState<'en' | 'de'>('en');
//   const [category] = useState<'language' | 'sociocultural'>('language');
//   const [priceAmount, setPriceAmount] = useState<string>('');
//   const [priceCurrency, setPriceCurrency] = useState<string>('EUR');
//   const [modules, setModules] = useState<ModuleItem[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
//   const coverInputRef = React.useRef<HTMLInputElement>(null);

//   const handleOpenChange = useCallback(
//     (open: boolean) => {
//       if (!open) onClose();
//     },
//     [onClose],
//   );

//   const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !file.type.startsWith('image/')) return;
//     if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
//     setCoverPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleCoverClick = () => coverInputRef.current?.click();

//   const handleCoverClear = () => {
//     if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
//     setCoverPreviewUrl(null);
//     if (coverInputRef.current) coverInputRef.current.value = '';
//   };

//   const toggleTag = (tag: string) => {
//     setSelectedTags((prev) =>
//       prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
//     );
//   };

//   const addModule = () => {
//     setModules((prev) => [
//       ...prev,
//       {
//         id: crypto.randomUUID(),
//         name: '',
//         lessons: [],
//         expanded: true,
//       },
//     ]);
//   };

//   const removeModule = (moduleId: string) => {
//     if (window.confirm('Delete this module and all its lessons?')) {
//       setModules((prev) => prev.filter((m) => m.id !== moduleId));
//     }
//   };

//   const toggleModule = (id: string) => {
//     setModules((prev) => prev.map((m) => (m.id === id ? { ...m, expanded: !m.expanded } : m)));
//   };

//   const updateModuleName = (id: string, value: string) => {
//     setModules((prev) => prev.map((m) => (m.id === id ? { ...m, name: value } : m)));
//   };

//   const addLesson = (moduleId: string) => {
//     setModules((prev) =>
//       prev.map((m) =>
//         m.id === moduleId
//           ? {
//               ...m,
//               lessons: [...m.lessons, { id: crypto.randomUUID(), name: '', url: '' }],
//             }
//           : m,
//       ),
//     );
//   };

//   const updateLesson = (
//     moduleId: string,
//     lessonId: string,
//     field: 'name' | 'url',
//     value: string,
//   ) => {
//     setModules((prev) =>
//       prev.map((m) =>
//         m.id === moduleId
//           ? {
//               ...m,
//               lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, [field]: value } : l)),
//             }
//           : m,
//       ),
//     );
//   };

//   const removeLesson = (moduleId: string, lessonId: string) => {
//     setModules((prev) =>
//       prev.map((m) =>
//         m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m,
//       ),
//     );
//   };

//   const totalLessons = useMemo(
//     () => modules.reduce((acc, m) => acc + m.lessons.length, 0),
//     [modules],
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitError(null);
//     if (!name.trim()) {
//       setSubmitError('Course name is required');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const body = {
//         title: name.trim(),
//         description: description.trim() || undefined,
//         language,
//         category,
//         is_published: false,
//         order_index: 0,
//       };
//       await apiInstance.post(API_ENDPOINTS.courses.create, body);
//       onClose();
//     } catch (err: unknown) {
//       const message =
//         err && typeof err === 'object' && 'response' in err
//           ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
//           : err instanceof Error
//             ? err.message
//             : 'Failed to create course';
//       setSubmitError(Array.isArray(message) ? message.join(', ') : String(message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <BaseDialog isOpen={isOpen} handleOpenChange={handleOpenChange} className="max-w-[720px]">
//       <div className="flex w-full flex-col">
//         <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col">
//           <div className="modal-scroll flex-1 px-6 pb-4">
//             <ModalHeader
//               title="Create new course"
//               description="Fill in the main details and course structure."
//               className="mb-6 text-left"
//             />

//             <section className="mb-6" aria-labelledby="course-card-label">
//               <p
//                 id="course-card-label"
//                 className="mb-2 text-xs font-semibold tracking-wide text-[var(--color-muted-foreground)] uppercase"
//               >
//                 Course card
//               </p>
//               <input
//                 ref={coverInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleCoverChange}
//                 className="sr-only"
//                 aria-label="Upload course cover"
//               />
//               <div
//                 role="button"
//                 tabIndex={0}
//                 onClick={handleCoverClick}
//                 onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCoverClick()}
//                 aria-label="Add course image"
//                 className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted)]/80"
//               >
//                 {coverPreviewUrl ? (
//                   <>
//                     <img
//                       src={coverPreviewUrl}
//                       alt="Course cover"
//                       className="h-full w-full object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCoverClear();
//                       }}
//                       aria-label="Remove image"
//                       className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
//                     >
//                       ×
//                     </button>
//                   </>
//                 ) : (
//                   <span className="flex flex-col items-center gap-1 text-[var(--color-muted-foreground)]">
//                     <Icon name={ICON_NAMES.CAMERA} size={40} aria-hidden />
//                     <span className="text-sm">Click to upload</span>
//                   </span>
//                 )}
//               </div>
//             </section>

//             <div className="mb-6 space-y-4">
//               <FormField
//                 label="Course name"
//                 name="courseName"
//                 error={submitError && !name.trim() ? submitError : undefined}
//               >
//                 <Input
//                   id="courseName"
//                   placeholder="e.g. German A1 – Foundations"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   aria-required
//                 />
//               </FormField>
//               <FormField label="Course description" name="courseDescription">
//                 <textarea
//                   id="courseDescription"
//                   placeholder="Short description of the course and what students will learn."
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={3}
//                   className="w-full rounded-[12px] border border-[var(--color-border-default)] px-4 py-2 outline-none focus-visible:shadow-[var(--shadow-input-default)] focus-visible:ring-0 focus-visible:ring-offset-0"
//                 />
//               </FormField>
//             </div>

//             <section
//               className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-muted)]/30 px-4 py-3"
//               aria-label="Course summary"
//             >
//               <span className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
//                 <Icon name={ICON_NAMES.BOOK} size={18} aria-hidden />
//                 <span aria-label="Total lessons">{totalLessons} lessons</span>
//               </span>
//             </section>

//             <section className="mb-6" aria-labelledby="price-label">
//               <p id="price-label" className="mb-2 text-sm font-medium">
//                 Price
//               </p>
//               <div className="flex flex-wrap gap-3">
//                 <div className="min-w-[120px] flex-1">
//                   <Input
//                     type="number"
//                     min={0}
//                     step={0.01}
//                     placeholder="0.00"
//                     value={priceAmount}
//                     onChange={(e) => setPriceAmount(e.target.value)}
//                     aria-label="Price amount"
//                   />
//                 </div>
//                 <select
//                   value={priceCurrency}
//                   onChange={(e) => setPriceCurrency(e.target.value)}
//                   aria-label="Currency"
//                   className="rounded-[12px] border border-[var(--color-border-default)] bg-white px-4 py-2 outline-none focus-visible:shadow-[var(--shadow-input-default)] focus-visible:ring-0 focus-visible:ring-offset-0"
//                 >
//                   {CURRENCY_OPTIONS.map((c) => (
//                     <option key={c} value={c}>
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
//                 For display only until backend supports price.
//               </p>
//             </section>

//             <section className="mb-6" aria-labelledby="tags-label">
//               <p id="tags-label" className="mb-2 text-sm font-medium">
//                 Tags
//               </p>
//               <p className="mb-2 text-xs text-[var(--color-muted-foreground)]">
//                 Choose one or more. Not saved to server until backend supports tags.
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {COURSE_TAG_OPTIONS.map((tag) => (
//                   <button
//                     key={tag}
//                     type="button"
//                     onClick={() => toggleTag(tag)}
//                     aria-pressed={selectedTags.includes(tag)}
//                     className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
//                       selectedTags.includes(tag)
//                         ? 'bg-[var(--color-primary)] text-white'
//                         : 'bg-[var(--color-muted)]/30 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/50'
//                     }`}
//                   >
//                     {tag}
//                   </button>
//                 ))}
//               </div>
//             </section>

//             <section className="mb-4" aria-labelledby="structure-label">
//               <h2 id="structure-label" className="mb-3 text-base font-semibold">
//                 Course structure
//               </h2>
//               {modules.map((mod, idx) => (
//                 <div
//                   key={mod.id}
//                   className="mb-4 rounded-xl border border-[var(--color-border-default)] bg-white p-4"
//                 >
//                   <div
//                     className="flex cursor-pointer items-center justify-between gap-2"
//                     onClick={() => toggleModule(mod.id)}
//                   >
//                     <span className="text-xs font-semibold tracking-wide text-[var(--color-muted-foreground)] uppercase">
//                       Module {idx + 1}
//                     </span>
//                     <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
//                       <Input
//                         placeholder="Module name"
//                         value={mod.name}
//                         onChange={(e) => updateModuleName(mod.id, e.target.value)}
//                         className="max-w-[200px]"
//                       />
//                       <span className="text-xs text-[var(--color-muted-foreground)]">
//                         {mod.lessons.length} lessons
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() => removeModule(mod.id)}
//                         aria-label="Remove module"
//                         className="rounded p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
//                       >
//                         ×
//                       </button>
//                       <Icon
//                         name={mod.expanded ? ICON_NAMES.CHEVRON_UP : ICON_NAMES.CHEVRON_DOWN}
//                         size={20}
//                         aria-hidden
//                       />
//                     </div>
//                   </div>
//                   {mod.expanded && (
//                     <div className="mt-4 space-y-3 border-t border-[var(--color-border-default)] pt-4">
//                       {mod.lessons.map((les) => (
//                         <div
//                           key={les.id}
//                           className="flex flex-wrap items-center gap-2 rounded-lg bg-[var(--color-muted)]/20 p-3"
//                         >
//                           <Icon name={ICON_NAMES.PLAY_ARROW} size={18} aria-hidden />
//                           <Input
//                             placeholder="Video name"
//                             value={les.name}
//                             onChange={(e) => updateLesson(mod.id, les.id, 'name', e.target.value)}
//                             className="min-w-[140px] flex-1"
//                           />
//                           <Input
//                             placeholder="YouTube URL"
//                             value={les.url}
//                             onChange={(e) => updateLesson(mod.id, les.id, 'url', e.target.value)}
//                             className="max-w-[200px] min-w-[160px]"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeLesson(mod.id, les.id)}
//                             aria-label="Remove lesson"
//                             className="rounded p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                       <Button type="button" variant="outlineDark" onClick={() => addLesson(mod.id)}>
//                         Add lesson
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <Button type="button" variant="solid" onClick={addModule}>
//                 + Add module
//               </Button>
//             </section>
//           </div>

//           <ModalFooter className="mt-4 flex-row justify-end gap-2 border-t border-[var(--color-border-default)] pt-4">
//             {submitError && name.trim() ? (
//               <p role="alert" className="w-full text-sm text-[var(--color-error)]">
//                 {submitError}
//               </p>
//             ) : null}
//             <div className="flex w-full justify-end gap-2">
//               <Button type="button" variant="outlineDark" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting} variant="solid">
//                 {isSubmitting ? 'Saving…' : 'Save course'}
//               </Button>
//             </div>
//           </ModalFooter>
//         </form>
//       </div>
//     </BaseDialog>
//   );
// };

// export default CreateCourseModal;
