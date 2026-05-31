"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const ContactForm = ({
  className = "",
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <form className={`flex w-full flex-col gap-y-4 ${className}`} {...props}>
      <Input
        placeholder="Enter Name"
        type="text"
        className="placeholder:text-primary text-primary w-full rounded-none border-white bg-white focus-visible:border-yellow-500 focus-visible:ring-yellow-500/70"
      />
      <Input
        placeholder="Email"
        type="email"
        className="placeholder:text-primary rounded-none border-white bg-white focus-visible:border-yellow-500 focus-visible:ring-yellow-500/70"
      />
      <Input
        placeholder="Phone Number"
        type="tel"
        className="placeholder:text-primary rounded-none border-white bg-white focus-visible:border-yellow-500 focus-visible:ring-yellow-500/70"
      />
      <Textarea
        placeholder="Write your quary"
        className="placeholder:text-primary rounded-none border-white bg-white focus-visible:border-yellow-500 focus-visible:ring-yellow-500/70"
      />
      <Button
        variant={"secondary"}
        className="rounded-none hover:bg-teal-400 hover:text-white"
      >
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
