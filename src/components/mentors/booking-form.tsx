"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { Mentor } from "@/lib/sanity/queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AlertCircle, CalendarDays, Clock, InfoIcon, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the form schema with zod
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    teamMembers: z.array(
      z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
      })
    ).optional().transform(arr => arr || []).refine(arr => arr.length <= 5, {
      message: "Maximum 5 team members allowed"
    }),
    topic: z.string().min(10, { message: "Please provide a topic for your session" })
      .max(100, { message: "Topic should be less than 100 characters" }),
    questions: z.string().max(500, { message: "Questions should be less than 500 characters" }).optional(),
  });

interface BookingFormProps {
  mentor: Mentor;
  date: string;
  time: string;
}

export function BookingForm({ mentor, date, time }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const router = useRouter();

  console.log("BookingForm rendering with props:", { mentorId: mentor._id, date, time });

  // Perform availability check when component mounts
  useEffect(() => {
    const checkAvailability = async () => {
      setIsCheckingAvailability(true);
      try {
        console.log(`Checking availability for mentor ${mentor._id} on ${date} at ${time}`);
        const response = await fetch(`/api/mentors/check-availability?mentorId=${mentor._id}&date=${date}&time=${time}`);
        console.log("Availability check response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Availability check error response:", errorText);
          setError(`Error checking availability: ${response.status} ${errorText}`);
          return;
        }

        const data = await response.json();
        console.log("Availability check response data:", data);
        
        if (!data.available) {
          // More detailed error handling
          setError(data.error || 'This time slot is no longer available');
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(`/mentors/${mentor._id}`);
          }, 3000);
        }
      } catch (error) {
        console.error("Error checking availability:", error);
        setError('Failed to verify availability. Please try again.');
      } finally {
        setIsCheckingAvailability(false);
      }
    };
    
    checkAvailability();
  }, [mentor._id, date, time, router]);

  // Set up form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      teamMembers: [],
      topic: "",
      questions: "",
    },
  });

  // Format the date and time for display
  const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");
  
  // Function to format time slot (e.g., "10:00" -> "10:00 AM")
  function formatTimeSlot(timeSlot: string) {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  }
  
  const formattedTime = formatTimeSlot(time);

  // Add a team member field
  const addTeamMember = () => {
    const currentTeamMembers = form.getValues("teamMembers") || [];
    
    // Check if we've reached the maximum number of team members
    if (currentTeamMembers.length >= 5) {
      setError("Maximum of 5 team members allowed");
      return;
    }
    
    form.setValue("teamMembers", [
      ...currentTeamMembers,
      { name: "", email: "" },
    ]);
  };

  // Remove a team member field
  const removeTeamMember = (index: number) => {
    const currentTeamMembers = form.getValues("teamMembers") || [];
    form.setValue(
      "teamMembers",
      currentTeamMembers.filter((_, i) => i !== index)
    );
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);
    setDebugInfo(null);
  
    try {
      // Check availability one more time before submitting
      console.log("Running final availability check before submission");
      const availabilityCheck = await fetch(`/api/mentors/check-availability?mentorId=${mentor._id}&date=${date}&time=${time}`);
      
      if (!availabilityCheck.ok) {
        const errorText = await availabilityCheck.text();
        throw new Error(`Error checking availability: ${availabilityCheck.status} ${errorText}`);
      }
      
      const availabilityData = await availabilityCheck.json();
      console.log("Final availability check result:", availabilityData);
      
      if (!availabilityData.available) {
        setError("This time slot is no longer available. Please select another time.");
        setIsSubmitting(false);
        return;
      }
  
      // Prepare payload for API call
      const payload = {
        mentorId: mentor._id,
        date,
        time,
        name: data.name,
        email: data.email,
        teamMembers: data.teamMembers || [],
        topic: data.topic,
        questions: data.questions || '',
      };
      
      console.log("Submitting booking with payload:", JSON.stringify(payload, null, 2));
      
      // Submit booking data to your API (which will trigger Make webhook)
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Booking API response status:", response.status);
      
      // Get response as text first to avoid JSON parsing errors
      const responseText = await response.text();
      console.log("Booking API raw response:", responseText);
      
      if (!response.ok) {
        // Try to parse the error as JSON
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (jsonError) {
          // If parsing fails, use the raw text
          throw new Error(`Server error (${response.status}): ${responseText || "No response details"}`);
        }
      }
      
      // Parse successful response
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed successful response:", result);
      } catch (parseError) {
        console.error("Error parsing success response:", parseError);
        throw new Error("Received invalid response from server");
      }
  
      // Redirect to confirmation page
      console.log("Redirecting to:", result.redirectUrl);
      router.push(result.redirectUrl || `/mentors/booking-confirmation?mentor=${mentor._id}&date=${date}&time=${time}`);
    } catch (err) {
      console.error("Complete booking error:", err);
      
      // Format detailed error info for debugging
      let errorDetails = "";
      if (err instanceof Error) {
        errorDetails = `${err.name}: ${err.message}\n${err.stack || ""}`;
      } else {
        errorDetails = String(err);
      }
      
      setDebugInfo(errorDetails);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  // Loading state for initial availability check
  if (isCheckingAvailability) {
    return (
      <Card className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm p-6 flex justify-center items-center" style={{ minHeight: "300px" }}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#473dc6] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#f1eae7] text-lg">Checking availability...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Book a Session with {mentor.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-[#f1eae7]/80">
            <CalendarDays className="h-5 w-5 mr-2 text-[#caa3d6]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-[#f1eae7]/80">
            <Clock className="h-5 w-5 mr-2 text-[#caa3d6]" />
            <span>{formattedTime} EST (30 minutes)</span>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-900/20 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {debugInfo && (
          <div className="mb-6 p-4 border border-yellow-500/50 bg-yellow-900/20 text-yellow-200 rounded-md overflow-auto">
            <details>
              <summary className="cursor-pointer font-medium">Technical Error Details (for debugging)</summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap">{debugInfo}</pre>
            </details>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f1eae7]">Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                        className="bg-[#2b2b2b]/30 border-[#473dc6]/30 placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f1eae7]">Your Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email address" 
                        type="email"
                        {...field} 
                        className="bg-[#2b2b2b]/30 border-[#473dc6]/30 placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Team Members Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Team Members (Optional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTeamMember}
                className="border-[#473dc6]/30 bg-[#2b2b2b]/30 text-[#f1eae7] hover:bg-[#473dc6]/20 hover:text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
            
            <div className="space-y-4">
              {form.watch("teamMembers")?.map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 border border-[#473dc6]/30 rounded-md bg-[#2b2b2b]/10">
                  <FormField
                    control={form.control}
                    name={`teamMembers.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#f1eae7]">Team Member Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter name" 
                            {...field} 
                            className="bg-[#2b2b2b]/30 border-[#473dc6]/30 placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <div className="flex-grow">
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#f1eae7]">Team Member Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter email" 
                                type="email"
                                {...field} 
                                className="bg-[#2b2b2b]/30 border-[#473dc6]/30 placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]"
                              />
                            </FormControl>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeamMember(index)}
                      className="mt-8 text-[#f1eae7]/70 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Session Details</h3>
            
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f1eae7]">Session Topic</FormLabel>
                  <FormDescription className="text-[#f1eae7]/60">
                    What would you like to discuss with the mentor? This helps them prepare for your session.
                  </FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="e.g., AI model optimization, Blockchain integration, User testing feedback" 
                      {...field} 
                      className="bg-[#2b2b2b]/30 border-[#473dc6]/30 placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="questions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f1eae7]">Specific Questions (Optional)</FormLabel>
                  <FormDescription className="text-[#f1eae7]/60">
                    List any specific questions you'd like to discuss during your session.
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your questions here..."
                      {...field} 
                      rows={3}
                      className="bg-[#2b2b2b]/30 border-[#473dc6]/30 placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-4 pt-4">
            <div className="flex items-start gap-2 p-4 rounded-md bg-[#473dc6]/20 border border-[#473dc6]/30">
              <InfoIcon className="h-5 w-5 text-[#caa3d6] mt-0.5" />
              <div className="text-[#f1eae7]/80 text-sm">
                <p>After booking, you will receive an email confirmation with a Google Meet link for your session. All team members will be included in the invitation.</p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="bg-[#473dc6] hover:bg-[#473dc6]/80 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Booking...
                </>
              ) : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}