import { Button, Card, CloseButton } from "@heroui/react";

export default function School() {
    return (
        <>
            <Card className="w-2/3 mx-auto items-stretch md:flex-row mt-10 border-2 bg-linear-to-r from-cyan-600 to-blue-900">
                <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
                    <img
                        alt="School Logo"
                        className="pointer-events-none absolute inset-0 h-full w-full scale-70 object-contain select-none"
                        loading="lazy"
                        src="https://suntisuk.ac.th/_files_school/55100582/data/55100582_0_20190906-090600.png"
                    />
                </div>
                <div className="flex flex-1 flex-col gap-3 my-auto">
                    <Card.Header className="gap-1">
                        <Card.Title className="pr-8 text-3xl mt-2 font-bold text-white mb-2">โรงเรียนสันติสุขพิทยาคม</Card.Title>
                        <Card.Description className="text-lg text-white">
                            45 หมู่ 8 ตำบลดู่พงษ์ อำเภอสันติสุข จังหวัดน่าน เขตพื้นที่การศึกษามัธยมศึกษาน่าน เขต 2
                        </Card.Description>
                    </Card.Header>
                </div>
            </Card>
        </>
    )
}