import { ArrowUpRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CardContainer,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from "../card";

type FAQItem = {
  question: string;
  answer: string;
  link?: string;
};

const content: FAQItem[] = [
  {
    question: "How do I earn Pi tokens on MitiMara?",
    answer:
      "You can earn Pi tokens by planting trees, verifying tree planting submissions, and participating in community challenges.",
  },
  {
    question: "How does the verification process work?",
    answer:
      "After you submit a tree planting entry, other users will review and verify your submission by comparing the photo with geolocation data. Once verified, you and the verifiers earn Pi tokens.",
  },
  {
    question: "What happens if my tree planting submission is not verified?",
    answer:
      "If your submission is not verified, you will not earn Pi tokens, and the temporarily reduced user points will not be restored. Ensure your submission is accurate and clear to increase the chances of verification.",
  },
  {
    question: "Can I change the location of my tree after submission?",
    answer:
      "No, once you confirm the location of your tree, it cannot be changed. Make sure the location is accurate before submitting.",
  },
  {
    question: "How can I track my tree planting activities and rewards?",
    answer:
      "You can track your activities and rewards through your user profile, which displays your tree planting history, earned Pi tokens, and overall environmental impact.",
  },
];

export function FAQs() {
  return (
    <CardContainer>
      <CardHeader>
        <CardIcon icon="message-circle" />
        <CardTitle>FAQs</CardTitle>
        <CardDescription>
          Can&apos;t find the answer you&apos;re looking for? Reach out to our
          telegram community.
        </CardDescription>
      </CardHeader>
      <div id="faq">
        <Accordion type="single" collapsible className="w-full">
          {content.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
                {faq.link && (
                  <a
                    href={faq.link}
                    className="mt-2 flex w-full items-center opacity-60 transition-all hover:opacity-100"
                  >
                    Learn more <ArrowUpRight className="ml-1" size="16" />
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </CardContainer>
  );
}
