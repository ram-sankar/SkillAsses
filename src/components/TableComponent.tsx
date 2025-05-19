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
}

const TableComponent: React.FC<TableComponentProps<any>> = ({
  data,
  columns,
  title,
  subtitle,
}) => {
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
                <TableCell>{column.title}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {" "}
                {columns.map((column) => (
                  <TableCell key={column.field || item.id}>
                    {renderTableCell(item, column)}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outlined" size="small">
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
