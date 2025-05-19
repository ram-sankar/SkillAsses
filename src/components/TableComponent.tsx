import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles/TableComponent.scss";

interface DataItem {
  [key: string]: any;
}

interface Column {
  title: string;
  field: any;
}

interface TableComponentProps<T extends DataItem> {
  data: T[];
  columns: Column[];
  title: string;
  subtitle?: string;
  baseUrl?: string;
}

const TableComponent: React.FC<TableComponentProps<any>> = ({
  data,
  columns,
  title,
  subtitle,
  baseUrl,
}) => {
  const navigate = useNavigate();

  const renderTableCell = (item: any, column: Column) => {
    if (column.title === "Status") {
      const cellValue = item[column.field];
      return (
        <span
          className={`status-badge ${cellValue
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {cellValue}
        </span>
      );
    } else {
      return item[column.field];
    }
  };

  const handleViewClick = (id: any) => {
    navigate(`${baseUrl}/${id}`);
  };

  return (
    <Box mt={4} className="genericTable">
      {" "}
      <Typography variant="h5">{title}</Typography>
      {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.title}>{column.title}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, itemIndex) => (
              <TableRow key={`${item.id}-${itemIndex}`}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={`${itemIndex}-${columnIndex}`}>
                    {renderTableCell(item, column)}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewClick(item?.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableComponent;
