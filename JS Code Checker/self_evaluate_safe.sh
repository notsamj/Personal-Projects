clear
cd src
node js_code_checker.js ./ ../src_modified/ default_with_no_logs
diff . ../src_modified > ../src_vs_modified.diff