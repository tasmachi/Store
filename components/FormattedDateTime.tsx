import { cn, formatDateTime } from "@/lib/utils";
import React from "react";

const FormattedDateTime = ({
  date,
  className,
}: {
  date: string;
  className?: string;
}) => {
  return (
    <p className={cn("text-light-200 body-1", className)}>
      {formatDateTime(date)}
    </p>
  );
};

export default FormattedDateTime;
