import os
import zipfile

# إعدادات الضغط
OUTPUT_ZIP = 'project_source.zip'
MAX_ZIP_SIZE_MB = 20
MAX_FILE_SIZE_MB = 5

# المجلدات والملفات الشائعة للمكتبات والملفات المؤقتة التي سيتم تجاهلها
IGNORED_DIRS = {
    'node_modules', '__pycache__', '.venv', 'venv', 'env', 
    '.git', '.replit', '.upm', 'poetry.lock', 'package-lock.json'
}
IGNORED_EXTENSIONS = {'.pyc', '.pyo', '.pyd', '.zip', '.tar.gz', '.rar'}

def create_source_zip():
    max_zip_bytes = MAX_ZIP_SIZE_MB * 1024 * 1024
    max_file_bytes = MAX_FILE_SIZE_MB * 1024 * 1024

    print("🚀 جاري بدء تجهيز ملف السورس كود...")

    with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # استبعاد مجلدات المكتبات والملفات المخفية
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith('.')]

            for file in files:
                file_path = os.path.join(root, file)

                # تجنب ضغط ملف الـ ZIP نفسه أو الملفات المؤقتة
                if file == OUTPUT_ZIP or os.path.splitext(file)[1] in IGNORED_EXTENSIONS:
                    continue

                try:
                    file_size = os.path.getsize(file_path)

                    # شرط: إلغاء أي ملف حجمه أكبر من 5 ميجا
                    if file_size > max_file_bytes:
                        print(f"⚠️ تخطي: {file_path} (حجمه {file_size / (1024*1024):.2f}MB يتعدى الـ 5MB)")
                        continue

                    # إضافة الملف إلى المضغوط
                    zipf.write(file_path, os.path.relpath(file_path, '.'))

                    # تحقق من حجم ملف الـ ZIP الإجمالي أثناء الضغط
                    if os.getsize(OUTPUT_ZIP) > max_zip_bytes:
                        print(f"🛑 تم إيقاف الضغط! حجم ملف الـ ZIP الإجمالي تجاوز {MAX_ZIP_SIZE_MB} ميجا.")
                        return False

                except Exception as e:
                    print(f"❌ خطأ أثناء معالجة الملف {file_path}: {e}")

    # فحص نهائي للحجم بعد إغلاق الملف
    final_size = os.path.getsize(OUTPUT_ZIP)
    if final_size > max_zip_bytes:
        print(f"🛑 تم حذف الملف لأن حجمه النهائي ({final_size / (1024*1024):.2f}MB) تعدّى الـ {MAX_ZIP_SIZE_MB} ميجا.")
        os.remove(OUTPUT_ZIP)
        return False

    print(f"🎉 تم بنجاح! الملف جاهز للتحميل باسم: {OUTPUT_ZIP}")
    print(f"📦 الحجم النهائي: {final_size / (1024*1024):.2f} MB")
    return True

if __name__ == '__main__':
    create_source_zip()
