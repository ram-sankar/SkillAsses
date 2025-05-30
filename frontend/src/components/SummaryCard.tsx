import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "./styles/SummaryCard.scss";

interface SummaryCardProps {
  title: string;
  count: number;
  href?: string;
}

const SummaryCard = ({ title, count, href }: SummaryCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="summaryCardNew">
      <CardContent className="summaryCardContent">
        <Box className="summaryText">
          <Typography variant="subtitle2" className="summaryLabel">
            {title}
          </Typography>
          <Typography variant="h3" className="summaryMetric">
            {count}
          </Typography>
        </Box>
        {href && (
          <Button
            onClick={() => navigate(href)}
            variant="ghost"
            className="summaryAction"
          >
            View →
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
