"use client"

import { useState } from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'

import type { Mentor } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { typography } from '@/lib/utils/typography'

// Constants for filtering
const TRACK_OPTIONS = [
    "AR/VR", "AI/ML", "Blockchain", "Web3",
    "Frontend", "Backend", "Design", "Product", "Mobile"
];

const EXPERTISE_OPTIONS = [
    "Software Engineering", "UX/UI Design", "Product Management",
    "Blockchain Development", "AI Research", "Web Development",
    "Mobile App Development", "Startup Strategy"
];

interface MentorsGridProps {
    initialMentors: Mentor[]
}

// Helper function to format availability slot
function formatAvailabilitySlot(slot: AvailabilitySlot): string {
    const startDate = new Date(slot.startDate);
    const endDate = new Date(slot.endDate);
    const startTime = slot.startTime;
    const endTime = slot.endTime;

    const formattedDate = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
        (startDate.toDateString() !== endDate.toDateString() ? ` - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : '');
    const formattedTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    return `${formattedDate}, ${formattedTime}`;
}

// Helper function to format time (HH:mm to 12-hour format)
function formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    let formattedHours = parseInt(hours, 10);
    const period = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12;
    formattedHours = formattedHours === 0 ? 12 : formattedHours;
    return `${formattedHours}:${minutes} ${period}`;
}

interface AvailabilitySlot {
    _key: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

export function MentorsGrid({ initialMentors }: MentorsGridProps) {
    const [mentors] = useState(initialMentors);
    const [selectedTrack, setSelectedTrack] = useState("");
    const [selectedExpertise, setSelectedExpertise] = useState("");
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
    const [currentEmailInput, setCurrentEmailInput] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        projectDetails: "",
        sessionGoals: "",
        selectedSlotKey: ""
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const { toast } = useToast();

    

    // Filter mentors based on track and expertise
    const filteredMentors = mentors.filter(mentor => {
        const trackMatch = !selectedTrack || mentor.tracks?.includes(selectedTrack);
        const expertiseMatch = !selectedExpertise || mentor.expertise?.includes(selectedExpertise);
        return trackMatch && expertiseMatch;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSlotSelect = (slotKey: string) => {
        setFormData({ ...formData, selectedSlotKey: slotKey });
    };


    const handleAddEmail = () => {
        if (currentEmailInput && !additionalEmails.includes(currentEmailInput)) {
            if (isValidEmail(currentEmailInput)) {
                setAdditionalEmails([...additionalEmails, currentEmailInput]);
                setCurrentEmailInput("");
            } else {
                toast({
                    title: "Invalid Email Format",
                    description: "Please enter a valid email address.",
                    variant: "destructive",
                });
            }
        } else if (additionalEmails.includes(currentEmailInput)) {
            toast({
                title: "Duplicate Email",
                description: "Email is already in the participants list.",
                variant: "destructive",
            });
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setAdditionalEmails(additionalEmails.filter(email => email !== emailToRemove));
    };


    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = "Your Name is required";
        }
        if (!formData.email.trim()) {
            errors.email = "Your Email is required";
        } else if (!isValidEmail(formData.email)) {
            errors.email = "Invalid email format";
        }
        if (!formData.projectDetails.trim()) {
            errors.projectDetails = "Project Details are required";
        }
        if (!formData.sessionGoals.trim()) {
            errors.sessionGoals = "Session Goals are required";
        }
        if (selectedMentor?.availability && selectedMentor.availability.length > 0 && !formData.selectedSlotKey) {
            errors.selectedSlotKey = "Please select an available time slot";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Form is valid, proceed with submission logic here
            const bookingData = {
                ...formData,
                additionalEmails: additionalEmails,
                mentorId: selectedMentor?._id,
            };
            console.log("Booking Request Data:", bookingData);
            // alert("Booking request submitted (placeholder - check console)");

            setFormData({
                name: "",
                email: "",
                projectDetails: "",
                sessionGoals: "",
                selectedSlotKey: ""
            });
            setAdditionalEmails([]);
            setSelectedMentor(null);
            setIsConfirmationOpen(true); // Open confirmation dialog instead of toast for success
            // toast({
            //     title: "Booking Request Submitted!",
            //     description: "We'll get back to you shortly.",
            // }); // Replaced by confirmation dialog
        } else {
            toast({
                title: "Error",
                description: "Please correct the highlighted fields.",
                variant: "destructive",
            });
        }
    };


    return (
        <section id="mentors-grid" className="container mx-auto px-4 py-16">
            {/* Filters */}
            <div className="flex justify-center space-x-4 mb-12">
                <Select
                    value={selectedTrack}
                    onValueChange={setSelectedTrack}
                >
                    <SelectTrigger className="w-[200px] bg-[#2A276B] text-white border-[#473dc6]">
                        <SelectValue placeholder="Select Track" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A276B] text-white border-[#473dc6]">
                        {TRACK_OPTIONS.map(track => (
                            <SelectItem
                                key={track}
                                value={track}
                                className="hover:bg-[#473dc6] focus:bg-[#473dc6]"
                            >
                                {track}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedExpertise}
                    onValueChange={setSelectedExpertise}
                >
                    <SelectTrigger className="w-[200px] bg-[#2A276B] text-white border-[#473dc6]">
                        <SelectValue placeholder="Select Expertise" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A276B] text-white border-[#473dc6]">
                        {EXPERTISE_OPTIONS.map(expertise => (
                            <SelectItem
                                key={expertise}
                                value={expertise}
                                className="hover:bg-[#473dc6] focus:bg-[#473dc6]"
                            >
                                {expertise}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Mentors Grid */}
            {filteredMentors.length === 0 ? (
                <div className="text-center text-white">
                    <p className="text-2xl mb-4">No mentors found</p>
                    <p className="text-gray-300">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMentors.map(mentor => (
                        <MentorCard
                            key={mentor._id}
                            mentor={mentor}
                            onBookNow={() => setSelectedMentor(mentor)}
                        />
                    ))}
                </div>
            )}

            {/* Mentor Booking Modal */}
            <Dialog
                open={!!selectedMentor}
                onOpenChange={() => setSelectedMentor(null)}
            >
                <DialogContent className="bg-[#2A276B] border-[#473dc6]">
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl">
                            Book a Session with {selectedMentor?.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Complete the form to request a mentorship session.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Your Name</label>
                            <Input
                                type="text"
                                id="name"
                                className="bg-[#1E1B4D] border-[#473dc6] text-white"
                                placeholder="Your Name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your Email</label>
                            <Input
                                type="email"
                                id="email"
                                className="bg-[#1E1B4D] border-[#473dc6] text-white"
                                placeholder="your.email@example.com"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                        </div>

                        {/* Additional Participant Emails Section */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">Additional Participant Emails (Optional)</label>
                            <div className="flex space-x-2 mb-2">
                                <Input
                                    type="email"
                                    placeholder="participant.email@example.com"
                                    className="bg-[#1E1B4D] border-[#473dc6] text-white flex-grow"
                                    value={currentEmailInput}
                                    onChange={(e) => setCurrentEmailInput(e.target.value)}
                                />
                                <Button type="button" onClick={handleAddEmail} variant="secondary" className="bg-[#473dc6] hover:bg-[#5A4CDB] text-white">
                                    Add
                                </Button>
                            </div>
                            {additionalEmails.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {additionalEmails.map((email, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 rounded-md bg-[#1E1B4D] text-white">
                                            <span>{email}</span>
                                            <Button
                                                type="button"
                                                onClick={() => handleRemoveEmail(email)}
                                                variant="destructive"
                                                size="icon"
                                                className="bg-destructive hover:bg-destructive/80 text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 01-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 5.47z" clipRule="evenodd" />
                                                </svg>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* End of Additional Participant Emails Section */}


                        <div>
                            <label htmlFor="projectDetails" className="block mb-2 text-sm font-medium text-white">Project/Team Details</label>
                            <Textarea
                                id="projectDetails"
                                rows={4}
                                className="bg-[#1E1B4D] border-[#473dc6] text-white"
                                placeholder="Brief description of your project or goals"
                                required
                                value={formData.projectDetails}
                                onChange={handleInputChange}
                            />
                            {formErrors.projectDetails && <p className="text-xs text-destructive mt-1">{formErrors.projectDetails}</p>}
                        </div>
                        <div>
                            <label htmlFor="sessionGoals" className="block mb-2 text-sm font-medium text-white">Session Goals</label>
                            <Textarea
                                id="sessionGoals"
                                rows={3}
                                className="bg-[#1E1B4D] border-[#473dc6] text-white"
                                placeholder="What do you hope to achieve in this session?"
                                required
                                value={formData.sessionGoals}
                                onChange={handleInputChange}
                            />
                            {formErrors.sessionGoals && <p className="text-xs text-destructive mt-1">{formErrors.sessionGoals}</p>}
                        </div>

                        {/* Time Slot Selection Section */}
                        {selectedMentor?.availability && selectedMentor.availability.length > 0 && (
                            <div className="space-y-2">
                                <label className="block mb-2 text-sm font-medium text-white">Select an Available Time Slot:</label>
                                <div className="space-y-1">
                                    {selectedMentor.availability.map((slot, index) => (
                                        <div key={slot._key} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`slot-${index}`}
                                                name="selectedSlot"
                                                value={slot._key}
                                                className="w-4 h-4 bg-[#1E1B4D] border-[#473dc6] focus:ring-accent focus:ring-offset-0 text-white"
                                                onChange={() => handleSlotSelect(slot._key)}
                                                checked={formData.selectedSlotKey === slot._key}
                                            />
                                            <label htmlFor={`slot-${index}`} className="ml-2 text-sm font-medium text-white">
                                                {formatAvailabilitySlot(slot)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {formErrors.selectedSlotKey && <p className="text-xs text-destructive mt-1">{formErrors.selectedSlotKey}</p>}
                            </div>
                        )}
                        {/* End of Time Slot Selection Section */}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    type="button"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
                <DialogContent className="bg-[#2A276B] border-[#473dc6]">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl">Booking Request Received!</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-gray-300">
                        Thank you for your booking request. We will get back to you shortly to confirm your session.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button">
                                Okay
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </section>
    )
}

interface MentorCardProps {
    mentor: Mentor;
    onBookNow: () => void;
}

function MentorCard({ mentor, onBookNow }: MentorCardProps) {
    return (
        <div className="bg-[#2A276B] rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-[#473dc6]/30">
            <div className="flex flex-col items-center text-center">
                {/* Mentor Image */}
                <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-[#473dc6]">
                    <Image
                        src={mentor.headshot ? urlFor(mentor.headshot).url() : "/placeholder-avatar.png"}
                        alt={mentor.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "/placeholder-avatar.png";
                        }}
                    />
                </div>

                {/* Mentor Details */}
                <h3 className="text-white font-bold text-2xl mb-2">
                    {mentor.name}
                </h3>
                <p className="text-gray-300 mb-4">
                    {mentor.title || mentor.company || 'Mentor'}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {mentor.expertise?.slice(0, 3).map((expertise, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-[#473dc6]/20 text-[#9747FF] rounded-full text-xs"
                        >
                            {expertise}
                        </span>
                    ))}
                </div>

                {/* Mentor Bio */}
                {mentor.bio && (
                    <div className="mb-4 text-left">
                        <h4 className={`${typography.subheading} text-white mb-2`}>Bio:</h4>
                        <p className="text-gray-300 line-clamp-3">
                            {mentor.bio[0]?.children?.[0]?.text || 'No bio available.'}
                        </p>
                    </div>
                )}

                {/* Social Links */}
                <div className="flex space-x-3 mb-4">
                    {mentor.linkedinUrl && (
                        <a
                            href={mentor.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                            >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Book Now Button */}
                <Button
                    onClick={onBookNow}
                    className="w-full bg-[#473dc6] hover:bg-[#5A4CDB] transition-colors"
                >
                    Book Mentorship Session
                </Button>
            </div>
        </div>
    )
}


// Basic email validation regex
const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};