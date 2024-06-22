import { Browser, Page, chromium, devices, expect, test } from "@playwright/test";

import { renderFields } from "../../helpers/render-fields";

import TypedField from "../../model/TypedField";
import FieldType from "../../model/FieldType";

declare var has: any;

test.describe('Form', { tag: "@forms" }, () => {

  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.beforeEach(async () => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.describe.configure({ retries: 3 });
  
  const fields: TypedField[] = [
    {
      type: FieldType.Paper,
      fieldBottomMargin: "1",
      fields: [
        {
          type: FieldType.Typography,
          typoVariant: "h6",
          placeholder: "General Information",
        },
        {
          type: FieldType.Text,
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "first_name",
          title: 'First Name',
        },
        {
          type: FieldType.Text,
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "last_name",
          title: 'Last Name',
        },
        {
          type: FieldType.Text,
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "middle_name",
          title: "Middle Name",
        },
        {
          type: FieldType.Text,
  
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "phone",
          title: "Phone",
          inputFormatterAllowed: /^[0-9]/,
          inputFormatterTemplate: "000000000000000",
        },
        {
          type: FieldType.Text,
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "additional_phone",
          title: 'Additional Phone',
          inputFormatterAllowed: /^[0-9]/,
          inputFormatterTemplate: "000000000000000",
        },
        {
          type: FieldType.Text,
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "email",
          title: 'Email',
        },
        {
          type: FieldType.Items,
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "source",
          title: 'Source',
          itemList: ["Telegram", "Facebook", "Instagram"],
        },
        {
          type: FieldType.Items,
          desktopColumns: "4",
          tabletColumns: "4",
          phoneColumns: "12",
          outlined: false,
          name: "looking_for",
          title: "Looking For",
          itemList: ["House", "Garage"],
        },
      ],
    },
    {
      type: FieldType.Paper,
      fieldBottomMargin: "1",
      fields: [
        {
          type: FieldType.Typography,
          typoVariant: "h6",
          placeholder: "Passport Information",
        },
        {
          type: FieldType.Text,
          desktopColumns: "6",
          tabletColumns: "6",
          phoneColumns: "12",
          outlined: false,
          name: "series_number",
          title: "Series Number",
        },
        {
          type: FieldType.Text,
          desktopColumns: "6",
          tabletColumns: "6",
          phoneColumns: "12",
          outlined: false,
          name: "issued_by",
          title: "Issued By",
          inputFormatterAllowed: /^[0-9 A-Za-z]/,
          inputFormatterTemplate: "000000000000000",
        },
        {
          type: FieldType.Date,
          desktopColumns: "6",
          tabletColumns: "6",
          phoneColumns: "12",
          outlined: false,
          name: "birth_date",
          title: 'Birth Date',
        },
        {
          type: FieldType.Combo,
          desktopColumns: "6",
          tabletColumns: "6",
          phoneColumns: "12",
          outlined: false,
          name: "country",
          title: 'Country',
          defaultValue: "USA",
          itemList: [
            "USA",
            "Turkey",
            "China"
          ],
        },
        {
          type: FieldType.Date,
          desktopColumns: "6",
          tabletColumns: "6",
          phoneColumns: "12",
          outlined: false,
          name: "given_date_from",
          title: "Date Issued",
        },
        {
          type: FieldType.Date,
          desktopColumns: "6",
          tabletColumns: "6",
          phoneColumns: "12",
          outlined: false,
          name: "given_date_to",
          title: 'Expiration Date',
        },
      ],
    },
    {
      type: FieldType.Paper,
      fieldBottomMargin: "1",
      fields: [
        {
          type: FieldType.Typography,
          typoVariant: "h6",
          placeholder: "Other",
        },
        {
          type: FieldType.Combo,
          title: 'Profile Status',
          outlined: false,
          itemList: ["First contact", "Active", "Inactive"],
          name: "profile_status",
        },
        {
          type: FieldType.Items,
          outlined: false,
          itemList: ["Group 1"],
          name: "profile_group",
          title: 'Profile Group',
        },
        {
          type: FieldType.Text,
          outlined: false,
          name: "comment",
          title: 'Comment',
          inputRows: 3,
        },
      ],
    },
  ];

  test("Will match mobile viewport", async () => {
    page.setViewportSize(devices['iPhone X'].viewport);
    await renderFields(page, fields);
    await expect(page).toHaveScreenshot({
        maxDiffPixels: 100,
    });
  });

  test("Will match desktop viewport", async () => {
    page.setViewportSize(devices['Desktop Chrome'].viewport);
    await renderFields(page, fields);
    await expect(page).toHaveScreenshot({
        maxDiffPixels: 100,
    });
  });

});
