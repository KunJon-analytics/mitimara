"use client";

import Link from "next/link";
import { createSerializer, type inferParserType } from "nuqs";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  searchParamsParsers,
  searchParamsUrlKeys,
} from "../../trees/searchParams";

type NearestTreesButtonProps = {
  searchParams: Partial<inferParserType<typeof searchParamsParsers>>;
  buttontext: string;
};

const NearestTreesButton = ({
  searchParams,
  buttontext,
  ...props
}: NearestTreesButtonProps & ButtonProps) => {
  const serialize = createSerializer(searchParamsParsers, {
    urlKeys: searchParamsUrlKeys,
  });
  const href = serialize("/app/trees", searchParams);

  return (
    <Button {...props} asChild>
      <Link href={href}>{buttontext}</Link>
    </Button>
  );
};

export default NearestTreesButton;
