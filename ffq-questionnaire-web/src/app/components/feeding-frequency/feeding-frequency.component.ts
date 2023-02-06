import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";

export interface FeedFrequencyData {
  frequency: string;
  quantity: string;
}

const FEED_FREQUENCY_DATA: FeedFrequencyData[] = [
  { frequency: "Every 2 hours", quantity: "12 times per day" },
  { frequency: "Every 2.5 hours", quantity: "10 times per day" },
  { frequency: "Every 3 hours", quantity: "8 times per day" },
  { frequency: "Every 3.5 hours", quantity: "7 times per day" },
  { frequency: "Every 4 hours", quantity: "6 times per day" },
  { frequency: "Every 5 hours", quantity: "5 times per day" },
  { frequency: "Every 6 hours", quantity: "4 times per day" },
  { frequency: "Every 8 hours", quantity: "3 times per day" },
  { frequency: "Every 12 hours", quantity: "2 times per day" },
  { frequency: "Every 24 hours", quantity: "1 time per day" },
];

@Component({
  selector: "app-feeding-frequency",
  templateUrl: "./feeding-frequency.component.html",
  styleUrls: ["./feeding-frequency.component.css"],
})
export class FeedingFrequencyComponent implements OnInit {
  infoDisabled = false;
  displayedColumns: string[] = ["frequency", "quantity"];
  dataSource = FEED_FREQUENCY_DATA;
  headers = ["Frequency", "Quantity"];

  ngOnInit(): void {}

  toggleFeedingTableDisable() {
    this.infoDisabled = !this.infoDisabled;
  }

  constructor(private translate: TranslateService, public dialog: MatDialog) {}
}
