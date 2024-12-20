import puppeteer from "puppeteer";
import { Buffer } from "buffer";
import mongoose from "mongoose";
import { userModel } from "../models/user.model";

interface Product {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  userId: mongoose.Types.ObjectId;
  products: Product[];
  date: Date;
  amount: number;
  totalamount: number;
  gst: number;
}

export const createPDF = async (invoice: Invoice): Promise<Buffer> => {
  try {
    const user = await userModel.findById(invoice.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const userName = user.name;
    const userEmail = user.email;

      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB'); 

    const htmlContent = `
<html>
<head>
    <title>Invoice</title>
</head>

<body style="position: relative;">
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px;">
        <div>
            <div
                style="font-family: Inter; font-weight: 600; font-size: 16px; line-height: 24.11px; text-align: right;">
                INVOICE GENERATOR</div>
            <div style="font-family: Inter; font-weight: 500; font-size: 10px; line-height: 11.42px; text-align: left;">
                Sample Output should be this</div>
        </div>

        <div>
            <svg width="116" height="38" viewBox="0 0 116 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M36.274 18.7422L27.6725 36.398H23.5981H9.83906L5.96975 28.7019L0.962402 18.7422L9.56395 1.08643H13.6384H27.6725L31.4219 8.78255L36.274 18.7422Z"
                    fill="black" />
                <path d="M23.5977 28.6997L28.5776 18.74L23.5977 8.78033L31.7466 18.74L23.5977 28.6997Z" fill="white" />
                <path
                    d="M12.2799 10.5926L13.638 8.78174L8.65817 18.7414L13.638 28.7011L5.94189 18.7414L12.2799 10.5926Z"
                    fill="white" />
                <path
                    d="M42.2841 20.2832V8.04411H43.4844V19.2013H49.2827V20.2832H42.2841ZM55.0135 20.4692C52.427 20.4692 50.8042 18.542 50.8042 15.7527C50.8042 12.9634 52.4608 10.9686 54.8444 10.9686C56.8392 10.9686 58.7663 12.3887 58.7663 15.4991V16.0401H51.9537C52.0044 18.1109 53.1793 19.438 55.0135 19.438C56.2813 19.438 57.0251 18.7787 57.3463 18.2039H58.5804C58.1747 19.4718 56.873 20.4692 55.0135 20.4692ZM51.9706 15.0427H57.583C57.583 13.3184 56.4673 12.0167 54.8613 12.0167C53.1962 12.0167 52.0636 13.386 51.9706 15.0427ZM67.6752 11.1039L64.328 20.2832H63.094L59.7468 11.1039H60.9978L63.6687 18.7787H63.7533L66.4411 11.1039H67.6752ZM69.4333 20.2832V11.1039H70.5828V20.2832H69.4333ZM70.0249 9.53174C69.5685 9.53174 69.1797 9.17674 69.1797 8.73721C69.1797 8.29769 69.5685 7.92578 70.0249 7.92578C70.4814 7.92578 70.8702 8.29769 70.8702 8.73721C70.8702 9.17674 70.4814 9.53174 70.0249 9.53174ZM76.77 11.1039V12.0844H74.8428V17.832C74.8428 18.9984 75.4852 19.3196 76.1783 19.3196C76.415 19.3196 76.7531 19.2858 76.939 19.2858V20.3677C76.7531 20.3846 76.4657 20.4184 76.0769 20.4184C74.8766 20.4184 73.6764 19.6408 73.6764 18.1194V12.0844H72.3071V11.1039H73.6764V8.90626H74.8428V11.1039H76.77ZM78.3928 17.7137C78.3928 15.8541 79.8974 15.1441 81.7738 14.992C82.3824 14.9497 83.87 14.8652 84.3095 14.8399V13.9777C84.3095 12.7437 83.515 11.9998 82.0781 11.9998C80.8778 11.9998 80.0664 12.5577 79.8466 13.386H78.6464C78.8324 11.9322 80.2355 10.9686 82.1457 10.9686C83.515 10.9686 85.459 11.5603 85.459 14.0791V20.2832H84.3095V18.8632H84.2419C83.87 19.6577 82.9571 20.4861 81.4188 20.4861C79.7452 20.4861 78.3928 19.4887 78.3928 17.7137ZM79.5424 17.7644C79.5424 18.8463 80.4045 19.4549 81.5878 19.4549C83.2783 19.4549 84.3095 18.2377 84.3095 16.7839V15.8034C83.8531 15.8372 82.3908 15.9471 81.9428 15.9725C80.32 16.0908 79.5424 16.7163 79.5424 17.7644ZM91.6462 11.1039V12.0844H89.7191V17.832C89.7191 18.9984 90.3614 19.3196 91.0545 19.3196C91.2912 19.3196 91.6293 19.2858 91.8153 19.2858V20.3677C91.6293 20.3846 91.3419 20.4184 90.9531 20.4184C89.7529 20.4184 88.5526 19.6408 88.5526 18.1194V12.0844H87.1833V11.1039H88.5526V8.90626H89.7191V11.1039H91.6462ZM93.7255 20.2832V11.1039H94.875V20.2832H93.7255ZM94.3172 9.53174C93.8607 9.53174 93.4719 9.17674 93.4719 8.73721C93.4719 8.29769 93.8607 7.92578 94.3172 7.92578C94.7736 7.92578 95.1624 8.29769 95.1624 8.73721C95.1624 9.17674 94.7736 9.53174 94.3172 9.53174ZM100.978 20.4692C98.5772 20.4692 96.9036 18.542 96.9036 15.7358C96.9036 12.9127 98.5772 10.9686 100.978 10.9686C103.378 10.9686 105.035 12.9127 105.035 15.7358C105.035 18.542 103.378 20.4692 100.978 20.4692ZM100.978 19.438C102.854 19.438 103.885 17.7475 103.885 15.7358C103.885 13.7241 102.854 12.0167 100.978 12.0167C99.0843 12.0167 98.0531 13.7241 98.0531 15.7358C98.0531 17.7475 99.0843 19.438 100.978 19.438ZM108.213 14.5863V20.2832H107.047V11.1039H108.162V12.5577H108.264C108.703 11.611 109.616 10.9856 110.968 10.9856C112.828 10.9856 114.079 12.1689 114.079 14.3496V20.2832H112.929V14.4341C112.929 12.9465 112.05 12.0337 110.664 12.0337C109.244 12.0337 108.213 12.9972 108.213 14.5863Z"
                    fill="black" />
                <path
                    d="M43.3522 29.6115V34.2012H42.9021V29.6115H43.3522ZM44.7976 32.0648V34.2012H44.3602V30.7589H44.7785V31.3041H44.8166C44.9814 30.9491 45.3237 30.7146 45.8309 30.7146C46.5282 30.7146 46.9973 31.1583 46.9973 31.9761V34.2012H46.5662V32.0078C46.5662 31.4499 46.2366 31.1076 45.7168 31.1076C45.1843 31.1076 44.7976 31.4689 44.7976 32.0648ZM49.3682 30.7589V31.1266H48.6075V34.2012H48.1764V31.1266H47.6439V30.7589H48.1764V30.2645C48.1764 29.7256 48.5124 29.396 49.0766 29.396C49.1907 29.396 49.3365 29.415 49.4316 29.434V29.8207C49.3302 29.8017 49.2351 29.8017 49.1653 29.8017C48.785 29.8017 48.6075 29.9792 48.6075 30.3532V30.7589H49.3682ZM51.251 34.2709C50.3508 34.2709 49.7232 33.5482 49.7232 32.4959C49.7232 31.4372 50.3508 30.7082 51.251 30.7082C52.1512 30.7082 52.7724 31.4372 52.7724 32.4959C52.7724 33.5482 52.1512 34.2709 51.251 34.2709ZM51.251 33.8842C51.9546 33.8842 52.3413 33.2503 52.3413 32.4959C52.3413 31.7415 51.9546 31.1013 51.251 31.1013C50.541 31.1013 50.1543 31.7415 50.1543 32.4959C50.1543 33.2503 50.541 33.8842 51.251 33.8842ZM54.9151 30.7589V31.1266H54.1924V33.282C54.1924 33.7194 54.4333 33.8398 54.6932 33.8398C54.782 33.8398 54.9088 33.8272 54.9785 33.8272V34.2329C54.9088 34.2392 54.801 34.2519 54.6552 34.2519C54.2051 34.2519 53.755 33.9603 53.755 33.3897V31.1266H53.2415V30.7589H53.755V29.9348H54.1924V30.7589H54.9151ZM57.0578 34.2709C56.0879 34.2709 55.4793 33.5482 55.4793 32.5022C55.4793 31.4563 56.1006 30.7082 56.9944 30.7082C57.7424 30.7082 58.4651 31.2407 58.4651 32.4071V32.61H55.9104C55.9294 33.3866 56.37 33.8842 57.0578 33.8842C57.5332 33.8842 57.8122 33.637 57.9326 33.4214H58.3954C58.2432 33.8969 57.7551 34.2709 57.0578 34.2709ZM55.9167 32.236H58.0214C58.0214 31.5894 57.603 31.1013 57.0007 31.1013C56.3763 31.1013 55.9516 31.6147 55.9167 32.236ZM60.5761 34.2709C59.6379 34.2709 59.042 33.5229 59.042 32.4959C59.042 31.4563 59.6569 30.7082 60.5698 30.7082C61.2671 30.7082 61.8059 31.1456 61.8947 31.7859H61.4636C61.3812 31.4119 61.0579 31.1013 60.5761 31.1013C59.9232 31.1013 59.4731 31.6591 59.4731 32.4832C59.4731 33.3073 59.9105 33.8842 60.5761 33.8842C61.0199 33.8842 61.3685 33.618 61.4636 33.1932H61.901C61.8059 33.8145 61.2988 34.2709 60.5761 34.2709ZM63.0611 32.0648V34.2012H62.6237V29.6115H63.0611V31.3041H63.0928C63.2576 30.9428 63.5873 30.7146 64.1134 30.7146C64.8108 30.7146 65.2862 31.152 65.2862 31.9761V34.2012H64.8551V32.0078C64.8551 31.4436 64.5255 31.1076 63.9993 31.1076C63.4541 31.1076 63.0611 31.4689 63.0611 32.0648Z"
                    fill="black" />
            </svg>
        </div>
    </div>

    <hr>

    <div class="gradient"
        style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; border-radius: 10px; padding: 30px; margin-inline: 10px;">
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="color: #CCF575; font-size: 25px; font-weight: 400; line-height: 18.96px; text-align:right;">
                ${userName}
            </div>
            <div style="color: #FFFFFF; font-size: 15px; font-weight: 400;line-height: 14.22px;text-align: right;">
                ${userEmail}
            </div>
        </div>
        <div style="color: #FFFFFF; font-size: 18px;">
            Date:${formattedDate}
        </div>
    </div>

    <div
        style="margin-inline: 10px; margin-top: 10px; width: 100%; display: flex; align-items: center; justify-content: center;">
        <table style="width: 100%;">
            <tr class="table" style="border-radius: 78px; color: black;">
                <th style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    Product</th>
                <th style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    Qty</th>
                <th style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    Rate</th>

                <th style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    Total Amount</th>
            </tr>

            ${invoice.products
              .map(
                (product: Product) => `
            <tr>
                <td style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    ${product.name}</td>
                <td style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    ${product.quantity}</td>
                <td style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    ₹ ${product.rate}</td>
                <td style="font-family: Inter; font-size: 17px; font-weight: 500; text-align: center; padding: 12px;">
                    ₹ ${product.rate * product.quantity}</td>
            </tr>
            `
              )
              .join("")}
        </table>
    </div>
    <div style="display: flex; justify-content:end; margin-inline: 10px; ">
        <div
            style="border: 1px solid #A2A2A2; width: 253px; height: 104px; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-around; border-radius: 8px; padding: 10px;">
            <div style="display: flex; justify-content: space-between; width:100%">
                <div style="font-family: Inter; font-size: 15px; font-weight: 500; line-height: 16.78px; text-align: left;">
                    Total Charges</div>
                <div style="font-family: Inter; font-size: 15px; font-weight: 500; line-height: 16.78px; text-align: left;">
                    ₹ ${invoice.amount}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; width:100%">
                <div style="font-family: Inter; font-size: 15px; font-weight: 400; line-height: 16.78px; text-align: left;">
                    GST (18%)</div>
                <div style="font-family: Inter; font-size: 15px; font-weight: 400; line-height: 16.78px; text-align: left;">
                    ₹ ${invoice.gst}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; width:100%">
                <div style="font-family: Inter; font-size: 18px; font-weight: 700; line-height: 16.78px; text-align: left;">
                    Total Amount</div>
                <div style="font-family: Inter; font-size: 18px; font-weight: 700; line-height: 16.78px; text-align: left;">
                    ₹ ${invoice.totalamount}
                </div>
            </div>
        </div>
    </div>




    <div style="font-family: Inter; font-size:20px; font-weight: 500; line-height: 13.39px; text-align: left; margin-inline: 10px;">
        Date: <span
            style="font-family: Inter; font-size: 20px; font-weight: 700; line-height: 13.39px; text-align: left;">${formattedDate}</span>
    </div>


    <footer
        style="background: rgb(39, 40, 51); color: black; border-radius: 20px; font-family: Inter; font-size: 15px; font-weight: 500; line-height: 13.39px; text-align: center; margin-inline: 18px; position: absolute; width: 90%; bottom: 10px; padding: 10px;">
        We are pleased to provide any further information you may require and look forward to assisting with your next
        order. Rest assured, it will receive our prompt and dedicated attention.
    </footer>
</body>
</html>
  `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.log(error);
    throw new Error("PDF generation failed");
  }
};
