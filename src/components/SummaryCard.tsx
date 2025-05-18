import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import Button from "./Button";
import "./styles/SummaryCard.scss";

interface SummaryCardProps {
  title: string;
  count: number;
  href?: string;
}

const SummaryCard = ({ title, count, href }: SummaryCardProps) => (
  <Card className="card-header">
    <CardHeader title={title} />
    <CardContent>
      <Typography variant="h4" className="card-count">
        {count}
      </Typography>
      {href && (
        <Button href={href} variant="outlined">
          View Details
        </Button>
      )}
    </CardContent>
  </Card>
);

export default SummaryCard;
